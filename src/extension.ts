import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    TransportKind,
} from 'vscode-languageclient/node';

let client: LanguageClient | undefined;

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

// Settings forwarded to the server. Empty paths let the server auto-detect the
// console's folders behind the @u/ and @s/ virtual folders.
function serverSettings() {
    const config = vscode.workspace.getConfiguration('mnemonimov');
    return {
        mnemonimov: {
            userProjectsPath: config.get<string>('userProjectsPath', ''),
            sampleProjectsPath: config.get<string>('sampleProjectsPath', ''),
        },
    };
}

function createClient(serverPath: string): LanguageClient {
    const serverOptions: ServerOptions = {
        command: serverPath,
        transport: TransportKind.stdio,
    };

    const clientOptions: LanguageClientOptions = {
        documentSelector: [
            { scheme: 'file', language: 'mnemonimov' },
            { scheme: 'untitled', language: 'mnemonimov' },
        ],
        initializationOptions: serverSettings(),
        synchronize: {
            // Included files may be closed: the server re-reads them when they
            // change on disk. project.mnemonimov marks a project's root.
            fileEvents: vscode.workspace.createFileSystemWatcher('**/{*.asm,*.misa,*.mnemo,project.mnemonimov}'),
        },
    };

    return new LanguageClient(
        'mnemonimov-lsp',
        'Mnemonimov Language Server',
        serverOptions,
        clientOptions
    );
}

async function startClient(context: vscode.ExtensionContext): Promise<void> {
    const serverPath = resolveServerPath(context.extensionPath);
    if (!serverPath) {
        vscode.window.showErrorMessage(
            'MISA LSP: server binary not found. ' +
            'Run "npm run build-lsp" in the extension directory, ' +
            'or set "mnemonimov.serverPath" in settings.'
        );
        return;
    }
    client = createClient(serverPath);
    await client.start();
}

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    context.subscriptions.push(
        vscode.commands.registerCommand('mnemonimov.restartServer', async () => {
            await client?.stop();
            client = undefined;
            await startClient(context);
        }),
        vscode.workspace.onDidChangeConfiguration(async (e) => {
            if (e.affectsConfiguration('mnemonimov.serverPath')) {
                await vscode.commands.executeCommand('mnemonimov.restartServer');
            } else if (e.affectsConfiguration('mnemonimov') && client) {
                await client.sendNotification('workspace/didChangeConfiguration', {
                    settings: serverSettings(),
                });
            }
        }),
    );

    await startClient(context);
}

export function deactivate(): Thenable<void> | undefined {
    return client?.stop();
}
