<div align="center">

<img src="assets/banner.png" alt="Mnemonimov ASM — VS Code language support for the Mnemonimov fantasy console" width="100%">

<br/>

**Full language support for MISA / Mnemonimov assembly in VS Code — syntax highlighting plus a bundled C++ language server. Install and go.**

<br/>

[![Marketplace](https://img.shields.io/badge/Marketplace-mnemonimov--asm-58a6ff?style=flat-square&logo=visualstudiocode&logoColor=white)](https://marketplace.visualstudio.com/items?itemName=RustyAstroboy.mnemonimov-asm)
[![Download .vsix](https://img.shields.io/badge/download-latest%20.vsix-7c3aed?style=flat-square&logo=github&logoColor=white)](https://github.com/mariusvn/vscode-menmonimov-asm/releases/latest)
[![CI](https://github.com/mariusvn/vscode-menmonimov-asm/actions/workflows/ci.yml/badge.svg)](https://github.com/mariusvn/vscode-menmonimov-asm/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE.md)

[**Features**](#-features) · [**Install**](#-install) · [**Settings**](#%EF%B8%8F-settings) · [**Build**](#%EF%B8%8F-build-from-source) · [**How it works**](#-how-it-works) · [**Language**](#-language-at-a-glance)

</div>

---

## ✨ Features

Beyond syntax highlighting, the extension bundles the [**MISA Language Server**](https://github.com/mariusvn/MISA-LSP) and wires it up automatically — no toolchain, no configuration.

| | Capability | What it does |
|:--:|:--|:--|
| 🎨 | **Syntax highlighting** | TextMate grammar covering the full MISA instruction set, registers, directives, types, conditions, syscalls and literals |
| 🩺 | **Diagnostics** | Unknown instructions, wrong arity, `int`/`float` literal mismatches, writes to read-only registers, undefined labels, missing `exit` |
| 💡 | **Hover** | Rich docs for every instruction, register (with ABI role), syscall (args & returns), type, condition and built-in symbol |
| ⌨️ | **Completion** | **Context-aware** — types after `lod`/`ste`, conditions after `cmp`, `SYS_*` after `syscall`, registers in operand slots |
| 🧭 | **Go to definition** | Jump to any label or constant, qualified names included (`PRINTER.MAPPING`) |
| 🔎 | **Find references** | Every use of a label or constant across the file |
| 🗂️ | **Document symbols** | Outline with entry-points highlighted and locals nested under their scope |
| 📐 | **Folding** | Label scopes, doc-comment blocks |

> 🛰️ The language server is shipped **prebuilt inside the `.vsix`** — installing the extension is all you need.

---

## 📦 Install

<details open>
<summary>🛒 <b>VS Code Marketplace</b> (recommended)</summary>

<br/>

Search **Mnemonimov ASM** in the Extensions view, or install it from the
[**Marketplace page**](https://marketplace.visualstudio.com/items?itemName=RustyAstroboy.mnemonimov-asm) — updates land automatically.

```bash
code --install-extension RustyAstroboy.mnemonimov-asm
```

</details>

<details>
<summary>⬇️ <b>Download the latest <code>.vsix</code> release</b></summary>

<br/>

Grab the prebuilt `.vsix` from the [**latest GitHub release**](https://github.com/mariusvn/vscode-menmonimov-asm/releases/latest), then:

```bash
code --install-extension mnemonimov-asm-<version>.vsix
```

Or in VS Code: **Extensions** → `···` menu → **Install from VSIX…**

</details>

Open any `.mnemo` or `.asm` file and the server starts automatically. That's it — diagnostics, hover and completion light up immediately.

| Extension | Language |
|-----------|----------|
| `.mnemo`  | Mnemonimov Assembly |
| `.asm`    | Mnemonimov Assembly |

---

## ⚙️ Settings

| Setting | Default | Description |
|:--|:--|:--|
| `mnemonimov.serverPath` | `""` | Absolute path to a custom `misa-lsp` executable. Leave empty to use the binary bundled with the extension. |

Handy when hacking on the language server — point it at your own build instead of repackaging the extension.

---

## 🛠️ Build from source

The language server lives in the [`MISA-LSP`](https://github.com/mariusvn/MISA-LSP) **git submodule** and is compiled into `bin/` at package time.

```bash
# 1. Clone with the LSP submodule
git clone --recursive https://github.com/mariusvn/vscode-menmonimov-asm.git
cd vscode-menmonimov-asm

# 2. Install dependencies
npm install

# 3. Build the language server (compiles the submodule, copies the binary to bin/)
npm run build-lsp

# 4. Package the extension
npx @vscode/vsce package        # → mnemonimov-asm-<version>.vsix
```

<details>
<summary>📦 <b>Prerequisites</b></summary>

<br/>

- **Node.js** (18+) & npm
- **CMake** ≥ 3.20
- A **C++20** compiler — MSVC 2022, GCC 12+, or Clang 15+
- Internet on the first LSP build (nlohmann/json is fetched automatically)

</details>

<details>
<summary>🧩 <b>Already cloned without <code>--recursive</code>?</b></summary>

<br/>

```bash
git submodule update --init --recursive
```

`npm run build-lsp` also initializes the submodule for you if it's missing.

</details>

<details>
<summary>🐛 <b>Develop & debug</b></summary>

<br/>

Press **F5** in this folder to launch an Extension Development Host with the extension loaded. `npm run watch` rebuilds `out/extension.js` on save. View server logs via **Output → Mnemonimov Language Server**.

</details>

---

## 🔧 How it works

The extension is a thin TypeScript client; all the language intelligence comes from the bundled server, which it spawns over **JSON-RPC 2.0 / stdio**.

```
   ┌──────────────────── VS Code ────────────────────┐
   │  out/extension.js  (vscode-languageclient)        │
   │      │                                            │
   │      │  spawn + JSON-RPC 2.0 over stdio           │
   │      ▼                                            │
   │  bin/misa-lsp(.exe)   ◄── built from the          │
   │      MISA-LSP submodule (C++20)                    │
   └───────────────────────────────────────────────────┘
```

```text
src/extension.ts   LSP client — resolves the server & starts the session
scripts/build-lsp.js   builds the submodule (Release) → copies binary to bin/
syntaxes/          TextMate grammar
MISA-LSP/          git submodule → github.com/mariusvn/MISA-LSP
bin/               bundled server binary (generated, git-ignored)
out/               bundled extension (esbuild, git-ignored)
```

**Server resolution order** (`src/extension.ts`): the `mnemonimov.serverPath` setting → the bundled `bin/` binary → a local submodule `build-release/` (dev fallback).

Packaging (`vscode:prepublish`) runs `build-lsp` then bundles the client with esbuild, so the `.vsix` ships only `bin/misa-lsp.exe` and `out/extension.js` — no source, no `node_modules`.

---

## 📝 Language at a glance

```misa
## Move the player and bounce it off the screen edge.
def SPEED 2

player_x: emb i32t 160        # data label, inspectable in the debugger

_update:
    lod  i32t, t0, player_x   # load  (types: i8t/u8t/…/f32t)
    add  t0, SPEED            # compact form: t0 += SPEED
    cmp  gte, t0, SCREEN_WIDTH
    jtr  .wrap
    str  i32t, player_x, t0
    exit
.wrap:
    str  i32t, player_x, zr   # zr always reads 0
    exit
```

| | |
|:--|:--|
| **Files** | `.mnemo`, `.asm` |
| **Comments** | `#` line · `##` doc-comment |
| **Integers** | `42` · `0x2a` · `0b101010` · `0o52` · `10_000` |
| **Floats** | `3.14` (no scientific notation) |
| **Strict typing** | `add 1.0` ❌ (wants int) · `fadd 1` ❌ (wants float) |
| **Labels** | global `foo:` · local `.bar:` · reusable `@loop:` + `@loop-` / `@end+` |

---

## 🤝 Contributing

Issues and pull requests are welcome! Language behaviour lives in the [MISA-LSP](https://github.com/mariusvn/MISA-LSP) repository — fixes to diagnostics, hover or completion belong there. This repo owns the VS Code integration and the TextMate grammar.

## 🧠 Development note

This project was built with the assistance of AI coding tools (Claude Code). The architecture, code, and integration were directed, reviewed, and validated by a human — including against real-world MISA programs.

## 📄 License

Released under the [**MIT License**](LICENSE.md).

<div align="center"><sub>Made for the Mnemonimov community · happy hacking 🎮</sub></div>
