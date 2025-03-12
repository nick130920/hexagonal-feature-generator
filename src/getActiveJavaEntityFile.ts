import * as path from 'path';
import * as vscode from 'vscode';
import { createExampleEntity } from './createExampleEntity';
import { GenerationOption, generationOptions } from './extension';

// --- Funciones Auxiliares ---
// Valida que exista un editor activo y que el archivo sea una entidad Java
export async function getActiveJavaEntityFile(): Promise<{ filePath: string; entityName: string; }> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        const response = await vscode.window.showQuickPick(['Sí', 'No'], {
            placeHolder: 'No tienes una entidad abierta. ¿Quieres generar una entidad de ejemplo?'
        });
        if (response === 'Sí') {
            await createExampleEntity();
        }
        throw new Error('No se encontró un archivo de entidad Java activo.');
    }
    const document = editor.document;
    if (document.languageId !== 'java') {
        throw new Error('El archivo activo no es una entidad Java.');
    }
    const filePath = document.uri.fsPath;
    const entityName = path.basename(filePath, '.java');
    return { filePath, entityName };
}
// Obtiene la raíz del proyecto
export function getWorkspaceRoot(): string {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        throw new Error('No se pudo encontrar la raíz del proyecto.');
    }
    return workspaceFolders[0].uri.fsPath;
}
// Permite al usuario seleccionar el tipo de API (GraphQL o REST)
export async function getApiType(): Promise<string> {
    const apiResponse = await vscode.window.showQuickPick(['GraphQL', 'REST'], {
        placeHolder: '¿Qué tipo de API deseas generar?'
    });
    return apiResponse === 'GraphQL' ? 'graphql' : 'rest';
}
// Procesa la configuración del usuario (por ejemplo, para Swagger)
export function processConfig(): { useSwagger: boolean; } {
    const config = vscode.workspace.getConfiguration('hexagonalFeatureGenerator');
    return { useSwagger: config.get<boolean>('useSwagger', true) };
}
// Devuelve una copia de las opciones de generación, ajustadas según la configuración y el tipo de API
export function getEffectiveGenerationOptions(apiType: string, config: { useSwagger: boolean; }): GenerationOption[] {
    return generationOptions
        .map(option => {
            // Si es REST Controller y Swagger está desactivado, se ajusta la plantilla
            if (option.label === 'REST Controller' && !config.useSwagger) {
                return { ...option, templateName: 'rest_controller_without_swagger.java.template' };
            }
            return option;
        })
        .filter(opt => opt.applicable(apiType));
}
// Permite al usuario seleccionar las capas a generar mediante un QuickPick multi-select
export async function getSelectedLayers(options: GenerationOption[]): Promise<string[]> {
    const labels = options.map(opt => opt.label);
    return (await vscode.window.showQuickPick(labels, {
        canPickMany: true,
        placeHolder: 'Selecciona las capas a generar'
    })) || [];
}
// Limpia el nombre del package eliminando partes redundantes
export function cleanPackageName(packageName: string): string {
    return packageName.split('.')
        .filter(part => part !== 'domain' && part !== 'model')
        .join('.');
}
