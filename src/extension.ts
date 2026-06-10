import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    TransportKind,
} from 'vscode-languageclient/node';

let client: LanguageClient;

const EXE = process.platform === 'win32' ? 'misa-lsp.exe' : 'misa-lsp';

function resolveServerPath(extensionPath: string): string | undefined {
    // 1. User override via setting
    const config = vscode.workspace.getConfiguration('mnemonimov');
    const override = config.get<string>('serverPath');
    if (override && override.length > 0) {
        return override;
    }

    // 2. Bundled binary (production install / after `npm run build-lsp`)
    const bundled = path.join(extensionPath, 'bin', EXE);
    if (fs.existsSync(bundled)) {
        return bundled;
    }

    // 3. Dev fallback: submodule Release build (before `npm run build-lsp` copies it to bin/)
    const devCandidates = [
        path.join(extensionPath, 'MISA-LSP', 'build-release', 'Release', EXE),
        path.join(extensionPath, 'MISA-LSP', 'build-release', EXE),
    ];
    const dev = devCandidates.find(p => fs.existsSync(p));
    if (dev) {
        return dev;
    }

    return undefined;
}

export function activate(context: vscode.ExtensionContext): void {
    const serverPath = resolveServerPath(context.extensionPath);

    if (!serverPath) {
        vscode.window.showErrorMessage(
            'MISA LSP: server binary not found. ' +
            'Run "npm run build-lsp" in the extension directory, ' +
            'or set "mnemonimov.serverPath" in settings.'
        );
        return;
    }

    const serverOptions: ServerOptions = {
        command: serverPath,
        transport: TransportKind.stdio,
    };

    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'mnemonimov' }],
        synchronize: {
            fileEvents: vscode.workspace.createFileSystemWatcher('**/*.{mnemo,asm}'),
        },
    };

    client = new LanguageClient(
        'mnemonimov-lsp',
        'Mnemonimov Language Server',
        serverOptions,
        clientOptions
    );

    client.start();
}

export function deactivate(): Thenable<void> | undefined {
    return client?.stop();
}
