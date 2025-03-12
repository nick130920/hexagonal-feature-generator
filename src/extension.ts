import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { FileGenerator, GenerationOptions } from './fileGenerator';
import { EntityParser } from './entityParser';
import { processTemplate } from './templateProcessor';
import { getActiveJavaEntityFile, getWorkspaceRoot, getApiType, processConfig, getEffectiveGenerationOptions, cleanPackageName, getSelectedLayers } from './getActiveJavaEntityFile';

// --- Tipos y Constantes ---
export interface GenerationOption {
    label: string;
    subDir: string;
    fileNamePattern: string;
    templateName: string;
    applicable: (apiType: string) => boolean;
}

// Opciones predefinidas (sin modificaciones globales)
export const generationOptions: GenerationOption[] = [
    { label: 'DTO Request', subDir: 'application/dto/request', fileNamePattern: '${entityName}Request.java', templateName: 'dto_request.java.template', applicable: () => true },
    { label: 'DTO Response', subDir: 'application/dto/response', fileNamePattern: '${entityName}Response.java', templateName: 'dto_response.java.template', applicable: () => true },
    { label: 'Mapper', subDir: 'application/mapper', fileNamePattern: '${entityName}Mapper.java', templateName: 'mapper.java.template', applicable: () => true },
    { label: 'Use Case', subDir: 'application/port/input', fileNamePattern: '${entityName}UseCase.java', templateName: 'use_case.java.template', applicable: () => true },
    { label: 'Service', subDir: 'application/service', fileNamePattern: '${entityName}Service.java', templateName: 'service.java.template', applicable: () => true },
    { label: 'Not Found Exception', subDir: 'application/exception', fileNamePattern: '${entityName}NotFoundException.java', templateName: 'Exception.java.template', applicable: () => true },
    { label: 'Repository Port', subDir: 'application/port/output', fileNamePattern: '${entityName}RepositoryPort.java', templateName: 'repository_port.java.template', applicable: () => true },
    { label: 'Repository Implementation', subDir: 'infrastructure/adapter/output/persistence', fileNamePattern: '${entityName}Repository.java', templateName: 'repository.java.template', applicable: () => true },
    { label: 'Spring Data Repository', subDir: 'infrastructure/adapter/output/persistence/jparepository', fileNamePattern: 'SpringData${entityName}Repository.java', templateName: 'spring_data_repository.java.template', applicable: () => true },
    { label: 'REST Controller', subDir: 'infrastructure/adapter/input/controller', fileNamePattern: '${entityName}RestController.java', templateName: 'rest_controller.java.template', applicable: (apiType) => apiType === 'rest' },
    { label: 'GraphQL Schema', subDir: 'graphql', fileNamePattern: '${entityName}.graphqls', templateName: 'graphql_schema.graphql.template', applicable: (apiType) => apiType === 'graphql' },
    { label: 'GraphQL Controller', subDir: 'infrastructure/adapter/input/graphql/controller', fileNamePattern: '${entityName}GraphQlController.java', templateName: 'graphql_controller.java.template', applicable: (apiType) => apiType === 'graphql' }
];

// --- Constantes de Rutas Comunes ---
export const JAVA_MAIN_PATH = 'src/main/java';

// --- Punto de Entrada de la Extensión ---
export function activate(context: vscode.ExtensionContext) {
    console.log('La extensión "hexagonal-feature-generator" está activa.');
    const disposable = vscode.commands.registerCommand('extension.generateHexagonalStructure', async () => {
        try {
            await runGenerator();
        } catch (err) {
            vscode.window.showErrorMessage(`Error: ${(err as Error).message}`);
        }
    });
    context.subscriptions.push(disposable);
}

// Función principal que orquesta el flujo de la extensión
async function runGenerator() {
    // 1. Obtiene el archivo Java activo
    const { filePath, entityName } = await getActiveJavaEntityFile();

    // 2. Obtiene la raíz del proyecto
    const projectRoot = getWorkspaceRoot();

    // 3. Permite seleccionar el tipo de API (GraphQL o REST)
    const apiType = await getApiType();

    // 4. Procesa la configuración del usuario (por ejemplo, uso de Swagger)
    const config = processConfig();

    // 5. Crea una copia de las opciones predefinidas, ajustando el template del REST Controller según Swagger
    const effectiveOptions = getEffectiveGenerationOptions(apiType, config);

    // 6. Lee y procesa el archivo de la entidad (package y atributos)
    const entityContent = await fs.promises.readFile(filePath, 'utf-8');
    let packageName = EntityParser.extractPackageName(entityContent);
    packageName = cleanPackageName(packageName);
    const attributes = EntityParser.extractAttributes(entityContent);

    // 7. Permite al usuario seleccionar las capas a generar mediante QuickPick
    const selectedLabels = await getSelectedLayers(effectiveOptions);
    if (!selectedLabels || selectedLabels.length === 0) {
        vscode.window.showErrorMessage('No se seleccionaron capas para generar.');
        return;
    }

    // 8. Genera cada archivo seleccionado utilizando FileGenerator
    const fileGenerator = new FileGenerator();
    for (const option of effectiveOptions) {
        if (selectedLabels.includes(option.label)) {
            const generationOpts: GenerationOptions = {
                projectRoot,
                subDir: option.subDir,
                fileName: option.fileNamePattern.replace('${entityName}', entityName),
                templatePath: path.join(__dirname, '..', 'templates', option.templateName),
                packageName: packageName,
                contentReplacer: (template: string) =>
                    processTemplate(template, packageName, entityName, attributes)
            };
            await fileGenerator.generateFile(generationOpts);
        }
    }
    vscode.window.showInformationMessage(`Estructura hexagonal generada para ${entityName}.`);
}

export function deactivate() {
    console.log('La extensión "Hexagonal Structure Generator" se ha desactivado.');
}
