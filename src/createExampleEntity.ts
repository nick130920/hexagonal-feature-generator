import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { JAVA_MAIN_PATH } from './extension';

// Crea una entidad de ejemplo si no hay un archivo activo
export async function createExampleEntity(): Promise<void> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showErrorMessage('No hay un espacio de trabajo abierto.');
        return;
    }
    const projectRoot = workspaceFolders[0].uri.fsPath;
    const exampleEntityPath = path.join(projectRoot, JAVA_MAIN_PATH, 'com', 'example', 'domain', 'model', 'Example.java');
    const exampleEntityContent = `package com.example.domain.model;

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
    await fs.promises.mkdir(path.dirname(exampleEntityPath), { recursive: true });
    await fs.promises.writeFile(exampleEntityPath, exampleEntityContent, 'utf-8');
    vscode.window.showInformationMessage('Entidad de ejemplo creada en: ' + exampleEntityPath);
}
