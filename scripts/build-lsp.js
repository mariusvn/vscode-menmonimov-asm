// Builds the MISA LSP server (git submodule) in Release mode and copies the
// resulting binary into bin/ so it can be bundled into the .vsix.
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const repoRoot = path.resolve(__dirname, '..');
const lspDir   = path.join(repoRoot, 'MISA-LSP');
const buildDir = path.join(lspDir, 'build-release');
const binDir   = path.join(repoRoot, 'bin');
const exe      = process.platform === 'win32' ? 'misa-lsp.exe' : 'misa-lsp';

// Ensure the submodule is checked out (fresh clones won't have it by default).
if (!fs.existsSync(path.join(lspDir, 'CMakeLists.txt'))) {
    console.log('MISA-LSP submodule missing — initializing...');
    execSync('git submodule update --init --recursive', { cwd: repoRoot, stdio: 'inherit' });
}

console.log('Configuring MISA LSP (Release)...');
execSync(
    `cmake -B "${buildDir}" -S "${lspDir}" -DBUILD_TESTING=OFF -DCMAKE_BUILD_TYPE=Release`,
    { stdio: 'inherit' }
);

console.log('Building MISA LSP...');
execSync(`cmake --build "${buildDir}" --config Release`, { stdio: 'inherit' });

fs.mkdirSync(binDir, { recursive: true });

// MSVC multi-config puts the binary in Release/, single-config generators don't.
const candidates = [
    path.join(buildDir, 'Release', exe),
    path.join(buildDir, exe),
];

const src = candidates.find(p => fs.existsSync(p));
if (!src) {
    console.error('Binary not found. Tried:\n' + candidates.join('\n'));
    process.exit(1);
}

const dst = path.join(binDir, exe);
fs.copyFileSync(src, dst);
console.log(`Copied ${src} -> ${dst}`);
