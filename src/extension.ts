import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';



export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "hexagonal-feature-generator" is now active!');

	const disposable = vscode.commands.registerCommand('extension.generateHexagonalStructure', async () => {
		// Obtiene el archivo actual abierto en el editor
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
			const userResponse = await vscode.window.showQuickPick(['Sí', 'No'], {
				placeHolder: 'No tienes una entidad abierta. ¿Quieres generar una entidad de ejemplo?'
			});
			if (userResponse === 'Sí') {
				await createExampleEntity();
			} else {
				vscode.window.showErrorMessage('Por favor, abre o crea un archivo de entidad Java.');
				return;
			}
        }

		// Verifica que el archivo sea un archivo Java (entidad)
        const document = editor?.document;
        if (document?.languageId !== 'java') {
            vscode.window.showErrorMessage('Por favor, abre un archivo de entidad Java.');
            return;
        }

		
        // Obtiene la ruta del archivo y el nombre de la entidad
        const entityFilePath = document.uri.fsPath;
        const entityName = path.basename(entityFilePath, '.java');
        const projectRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

        if (!projectRoot) {
            vscode.window.showErrorMessage('No se pudo encontrar la raíz del proyecto.');
            return;
        }

        try {
            // Genera la estructura hexagonal
            await generateHexagonalStructure(projectRoot, entityName, entityFilePath);
            vscode.window.showInformationMessage(`Estructura hexagonal generada para ${entityName}.`);
        } catch (error) {
            if (error instanceof Error) {
                vscode.window.showErrorMessage(`Error al generar la estructura: ${error.message}`);
            } else {
                vscode.window.showErrorMessage('Error al generar la estructura: error desconocido.');
            }
        }
    });

	context.subscriptions.push(disposable);
}

async function createExampleEntity() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No hay un espacio de trabajo abierto.');
        return;
    }

    const projectRoot = workspaceFolders[0].uri.fsPath;
    const exampleEntityPath = path.join(projectRoot, 'src', 'main', 'java', 'com', 'example', 'domain', 'model', 'Example.java');

    const exampleEntityContent = `
		package com.example.domain.model;

		import lombok.Data;
		import jakarta.persistence.Entity;
		import jakarta.persistence.GeneratedValue;
		import jakarta.persistence.GenerationType;
		import jakarta.persistence.Id;

		@Entity
		@Data
		public class Example {
			@Id
			@GeneratedValue(strategy = GenerationType.IDENTITY)
			private Long id;
			private String name;
			private String description;
		}
`;

    fs.mkdirSync(path.dirname(exampleEntityPath), { recursive: true });
    fs.writeFileSync(exampleEntityPath, exampleEntityContent, 'utf-8');
    vscode.window.showInformationMessage('Entidad de ejemplo creada en: ' + exampleEntityPath);
}

// Función para generar la estructura hexagonal
async function generateHexagonalStructure(projectRoot: string, entityName: string, entityFilePath: string) {
    const userResponse = await vscode.window.showQuickPick(['GraphQL', 'REST'], {
        placeHolder: '¿Qué tipo de API deseas generar?'
    });

    let apiType = 'REST';
    if (userResponse === 'GraphQL') {
        apiType = 'graphql';
    } 

    // Leer configuración del usuario
    const config = vscode.workspace.getConfiguration('hexagonalFeatureGenerator');
    const useSwagger = config.get<boolean>('useSwagger', true); // Swagger activado por defecto

    // Define las carpetas que se crearán
    const directories = [
        'application/dto/request',
        'application/dto/response',
        'application/mapper',
        'application/service',
        'application/exception',
        'application/port/input',
        'application/port/output',
        'infrastructure/adapter/output/persistence',
        'infrastructure/adapter/output/persistence/jparepository'
    ];
    directories.push(apiType === 'graphql' ? 'infrastructure/adapter/input/graphql/controller' : 'infrastructure/adapter/input/controller');

    // Lee y procesa el archivo de la entidad para obtener atributos
    const entityContent = fs.readFileSync(entityFilePath, 'utf-8');
    const packageName = cleanPackageName(extractPackageName(entityContent));
    const attributes = extractAttributes(entityContent);

    // Crea las carpetas necesarias
    for (const dir of directories) {
        const fullPath = path.join(projectRoot, 'src', 'main', 'java', ...packageName.split('.'), dir);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }
    }

    // Determinar la plantilla del controlador REST (con o sin Swagger)
    const restTemplate = useSwagger ? 'rest_controller.java.template' : 'rest_controller_without_swagger.java.template';

    // Genera los archivos basados en las plantillas
    await generateFile(projectRoot, 'application/dto/request', `${entityName}Request.java`, 'dto_request.java.template', packageName, entityName, attributes);
    await generateFile(projectRoot, 'application/dto/response', `${entityName}Response.java`, 'dto_response.java.template', packageName, entityName, attributes);
    await generateFile(projectRoot, 'application/mapper', `${entityName}Mapper.java`, 'mapper.java.template', packageName, entityName, attributes);
    await generateFile(projectRoot, 'application/port/input', `${entityName}UseCase.java`, 'use_case.java.template', packageName, entityName, attributes);
    await generateFile(projectRoot, 'application/service', `${entityName}Service.java`, 'service.java.template', packageName, entityName, attributes);
    await generateFile(projectRoot, 'application/exception', `${entityName}NotFoundException.java`, 'Exception.java.template', packageName, entityName, attributes);
    await generateFile(projectRoot, 'application/port/output', `${entityName}RepositoryPort.java`, 'repository_port.java.template', packageName, entityName, attributes);
    await generateFile(projectRoot, 'infrastructure/adapter/output/persistence', `${entityName}Repository.java`, 'repository.java.template', packageName, entityName, attributes);
    await generateFile(projectRoot, 'infrastructure/adapter/output/persistence/jparepository', `SpringData${entityName}Repository.java`, 'spring_data_repository.java.template', packageName, entityName, attributes);

    if (apiType === 'graphql') {
        await generateFile(projectRoot, 'graphql', `${entityName}.graphqls`, 'graphql_schema.graphql.template', packageName, entityName, attributes);
        await generateFile(projectRoot, 'infrastructure/adapter/input/graphql/controller', `${entityName}GraphQlController.java`, 'graphql_controller.java.template', packageName, entityName, attributes);
    } else {
        await generateFile(projectRoot, 'infrastructure/adapter/input/controller', `${entityName}RestController.java`, restTemplate, packageName, entityName, attributes);
    }
}

// Función para extraer el nombre del paquete del archivo Java
function extractPackageName(content: string): string {
    const packageLine = content.split('\n').find(line => line.trim().startsWith('package '));
    if (!packageLine) {
        throw new Error('No se pudo encontrar la declaración del paquete en el archivo.');
    }
    return packageLine.trim().replace('package ', '').replace(';', '').trim();
}

// Función para extraer los atributos de la entidad
function extractAttributes(content: string): Array<{ type: string; name: string }> {
    const attributes: Array<{ type: string; name: string }> = [];
    const lines = content.split('\n');

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('private ')) {
            const tokens = trimmedLine.split(' ');
            if (tokens.length === 3) {
                const type = tokens[1];
                const name = tokens[2].replace(';', '');
                attributes.push({ type, name });
            }
        }
    }

    return attributes;
}

// Función para generar un archivo a partir de una plantilla
async function generateFile(projectRoot: string, subDir: string, fileName: string, templateName: string, packageName: string, entityName: string, attributes: Array<{ type: string; name: string }>) {
    const templatePath = path.join(__dirname, '..', 'templates', templateName);
    const templateContent = fs.readFileSync(templatePath, 'utf-8');

    const isGraphQL = templateName === 'graphql_schema.graphql.template';

    const fields = isGraphQL 
    ? attributes.map(attr => `    ${attr.name}: ${mapJavaTypeToGraphQLType(attr.type)}`).join('\n') 
    : attributes.map(attr => `    private ${attr.type} ${attr.name};`).join('\n');

    

    // Procesa la plantilla
    const content = processedContent(templateContent, packageName, entityName, fields, attributes);

  
    // Escribe el archivo generado
    const mainPath = path.join('src', 'main', isGraphQL ? 'resources' : 'java');
    const fullPath = path.join(
        projectRoot,
        mainPath,
        ...(isGraphQL ? [subDir, fileName] : [...packageName.split('.'), subDir, fileName])
    );

    await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.promises.writeFile(fullPath, content, 'utf-8');
}

function processedContent(content: string, packageName: string, entityName: string, fields: string, attributes: Array<{ type: string; name: string }>): string {
    return content
    .replace(/\${PACKAGE}/g, packageName)
    .replace(/\${FEATURE}/g, entityName)
    .replace(/\${FEATURE_LOWER}/g, entityName.toLowerCase())
    .replace(/\${FEATURE_PLURAL}/g, pluralize(entityName.toLowerCase()))
    .replace(/\${FEATURE_PLURAL_CAPITAL}/g, pluralize(entityName))
    .replace(/\${FIELDS}/g, fields)
    .replace(/\${SETTERS}/g, attributes.map(attr => `        entity.set${attr.name.charAt(0).toUpperCase() + attr.name.slice(1)}(request.get${attr.name.charAt(0).toUpperCase() + attr.name.slice(1)}());`).join('\n'));
;
}

function mapJavaTypeToGraphQLType(javaType: string): string {
    switch (javaType.toLowerCase()) {
        case 'string':
            return 'String';
        case 'int':
        case 'integer':
        case 'long':
            return 'Int';
        case 'double':
        case 'float':
            return 'Float';
        case 'boolean':
            return 'Boolean';
        default:
            return 'String'; // Tipo por defecto
    }
}

function cleanPackageName(packageName: string): string {
    return packageName
        .split('.')
        .filter(part => part !== 'domain' && part !== 'model')
        .join('.');
}


function pluralize(word: string): string {
    const irregularPlurals: { [key: string]: string } = {
        child: "children",
        person: "people",
        mouse: "mice",
        goose: "geese",
        tooth: "teeth",
        foot: "feet",
        man: "men",
        woman: "women",
        sheep: "sheep",
        fish: "fish",
        deer: "deer",
        series: "series",
        species: "species",
        genus: "genera",
        medium: "media"
    };

    if (irregularPlurals[word]) {
        return irregularPlurals[word];
    }

    const pluralRules: Array<[RegExp, string]> = [
        // Palabras que terminan en 'ss' agregan 'es' (por ejemplo, "class" → "classes")
        [/ss$/, 'sses'],
        // Palabras que terminan en 's', 'x', 'z', 'ch', 'sh' agregan 'es'
        [/[sxz]$|ch$|sh$/, 'es'],
        // Palabras que terminan en 'y' precedida de una consonante, cambian 'y' a 'ies'
        [/[aeiou]y$/i, 'ies'],
        // Palabras que terminan en 'f' o 'fe', cambian a 'ves'
        [/f$|fe$/, 'ves'],
        // Palabras que terminan en 'o' precedida de una consonante, agregan 'es'
        [/[^aeiou]o$/, 'es'],
        

        [/$/, 's']
    ];

    for (const [rule, suffix] of pluralRules) {
        if (rule.test(word)) {
            return word.replace(rule, suffix);
        }
    }

    return word + 's';
}

export function deactivate() {
	console.log('La extensión "Hexagonal Structure Generator" se ha desactivado.');
}
