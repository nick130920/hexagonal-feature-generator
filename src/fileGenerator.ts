import * as fs from 'fs';
import * as path from 'path';

export interface GenerationOptions {
    projectRoot: string;
    subDir: string;
    fileName: string;
    templatePath: string;
    packageName: string;
    contentReplacer: (template: string) => string;
}

export class FileGenerator {
    async generateFile(options: GenerationOptions): Promise<void> {
        const { projectRoot, subDir, fileName, templatePath, packageName, contentReplacer } = options;
        if (!fs.existsSync(templatePath)) {
            throw new Error(`No se encontró la plantilla: ${templatePath}`);
        }
        const isGraphQL = templatePath.endsWith('.graphql.template');
        const templateContent = fs.readFileSync(templatePath, 'utf-8');
        const content = contentReplacer(templateContent);
        // Para archivos GraphQL se usa resources, de lo contrario java
        const mainPath = path.join('src', 'main', isGraphQL ? 'resources' : 'java');
        const fullPath = path.join(projectRoot, mainPath, ...(isGraphQL ? [subDir, fileName] : [...packageName.split('.'), subDir, fileName]));
        await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.promises.writeFile(fullPath, content, 'utf-8');
    }
}
