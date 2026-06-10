# Changelog

All notable changes to the **mnemonimov-asm** extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-06-10

The extension grows from syntax-highlighting-only into a full language client. It now
bundles the [MISA Language Server](https://github.com/mariusvn/MISA-LSP) and starts it
automatically — **nothing to install or configure**.

### Added

- **Language server integration** — the extension spawns a bundled `misa-lsp` binary over
  JSON-RPC 2.0 / stdio, powering:
  - **Diagnostics** — unknown instructions, wrong arity, `int`/`float` literal mismatches,
    writes to read-only registers, undefined labels, missing `exit`
  - **Hover** — docs for every instruction, register (with ABI role), syscall, type,
    condition and built-in symbol
  - **Context-aware completion** — types after `lod`/`ste`, conditions after `cmp`,
    `SYS_*` after `syscall`, registers in operand slots
  - **Go to definition** and **find references** for labels and constants (qualified
    names included)
  - **Document symbols** outline with entry points highlighted and locals nested
  - **Signature help** for instruction operands and syscall arguments
  - **Folding** for label scopes and doc-comment blocks
- `mnemonimov.serverPath` setting to point at a custom language-server build
- The language server ships **prebuilt inside the `.vsix`** — no toolchain required to use it

### Changed

- The extension now activates on `mnemonimov` files (`onLanguage:mnemonimov`)
- Reworked README with install options (Marketplace / `.vsix` release), feature overview,
  architecture, and build-from-source instructions
- Client bundled with esbuild; the language server is built from the
  [`MISA-LSP`](https://github.com/mariusvn/MISA-LSP) git submodule at package time

### Build & CI

- Added `scripts/build-lsp.js` to build the submodule (Release) and stage the binary in `bin/`
- Added GitHub Actions: CI (build & package `.vsix`) and Release (attach `.vsix` to tagged releases)

## [0.0.2] — 2026-06-07

### Changed

- Removed unwanted files from the `.vsix` package

## [0.0.1] — 2026-06-07

### Added

- Full syntax highlighting for the MISA (Mnemonimov Instruction Set Architecture) assembly language
- Support for `.mnemo` and `.asm` file extensions
- Highlighting for all instruction categories:
  - Arithmetic (`add`, `sub`, `mul`, `div`, `pow`, `clp`, `rnd`, …)
  - Floating-point (`fadd`, `fsin`, `fcos`, `fsqrt`, `flrp`, `fatan2`, …)
  - Vector (`vpsh`, `vpop`, `vmov`, `vfadd`, `vfsub`, `vfmul`, …)
  - Logic & bitwise (`cmp`, `and`, `orr`, `xor`, `sll`, `sar`, `rol`, …)
  - Bit manipulation (`rvb`, `ppc`, `clz`, `ctz`, `sbx`, `ubx`, `bfi`, `pbx`, `pbd`)
  - Data transfer (`mov`, `lod`, `str`, `cea`, `lde`, `ste`, `psh`, `pop`, `swp`, …)
  - Control flow (`cal`, `ret`, `jmp`, `jtr`, `jfs`, `nop`)
  - Drawing (`gbpx`, `sbpx`, `gtpx`, `stpx`, `norm`, `dnrm`)
  - System (`syscall`, `break`, `yield`, `exit`)
- Highlighting for all registers: `t0`–`t15`, `a0`–`a15`, `s0`–`s31`, `zr`, `cr`, `ea`, `pa`, `ba`, `sp`, `fp`, `pc`
- Highlighting for assembler directives: `def`, `undef`, `emb`, `res`, `bmk`, `sbmk`
- Highlighting for data types: `i8t`, `u8t`, `i16t`, `u16t`, `i32t`, `u32t`, `f32t`, `string`, `file`
- Highlighting for `cmp` conditions: `eq`, `neq`, `lt`, `lte`, `gt`, `gte`, `ltu`, `lteu`, `gteu`, `feqa`, `fneqa`, `flt`, `fgt`, `fnan`, `finf`
- Highlighting for all `SYS_*` system call identifiers
- Highlighting for built-in symbols: `true`, `false`, `PI`, `TAU`, `EXP1`, `INF`, `NAN`, `SCREEN_WIDTH`, `SCREEN_HEIGHT`, `BTN_*`, `$`
- Highlighting for numeric literals: decimal, hexadecimal (`0x`), binary (`0b`), octal (`0o`), floating-point — with underscore separator support
- Highlighting for double-quoted string literals and escape sequences
- Highlighting for global labels (`name:`), local labels (`.name:`), and reusable labels (`@name:` / `@name±`)
- Distinct highlighting for regular comments (`#`) and documentation comments (`##`)
- Highlighting for expression and vector range operators
