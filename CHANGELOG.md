# Changelog

All notable changes to the **mnemonimov-asm** extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] — 2026-09-25

Brings the extension up to date with **Mnemonimov manual v0.1.6**. Bundles
[MISA-LSP 0.2.0](https://github.com/mariusvn/MISA-LSP/blob/main/CHANGELOG.md).

### Added

- **`include` directive and multi-file projects**
  - Highlighting for `include "path"`, with the `@u/` (user projects) and `@s/` (sample
    projects) virtual folders.
  - The language server follows includes recursively, each file once (cycles are ignored), just
    like the assembler. Labels and constants from included files are known everywhere.
  - A library opened on its own is analysed through its project's `main.asm` (the folder
    with `project.mnemonimov`), when `main.asm` includes it.
  - Go to definition and find references work across files. Go to definition on an include
    path opens that file.
  - `include` and `emb file` paths are clickable links.
  - Diagnostics for missing or unresolvable files, duplicate or circular includes, and a
    summary on the include line when an included file has errors.
- **Character literals** — `'a'` … `'abcd'` (packed big-endian), with the escape sequences
  `\0 \t \n \' \" \\` in character and string literals. Hovering one shows its value.
- **Keyboard, mouse and terminal input**
  - Entry points `_keyboard_input`, `_mouse_button_input` and `_terminal_input`.
  - Built-ins `KEY_*`, `KBE_*`, `MOUSE_BTN_*` and `MAX_TERMINAL_INPUT_SIZE`.
- **New syscalls** — `SYS_PRINT_LINE_INT`, `SYS_PRINT_LINE_FLOAT`, `SYS_PRINT_LINE_STRING`,
  `SYS_GET_MOUSE_POSITION`, `SYS_GET_MOUSE_BUTTON_INPUT`, `SYS_GET_KEYBOARD_INPUT`,
  `SYS_GET_TERMINAL_INPUT_SIZE`, `SYS_READ_TERMINAL_INPUT`, `SYS_ALLOW_UNSAFE_JUMP`.
- **New instructions** — `cala`, `jmpa`, `jtra`, `jfsa` (pa-relative branches), `fma`, and the
  unsigned variants `mlhu`, `divu`, `remu`, `minu`, `maxu`, `clpu`. Also the `gtu` condition.
- **More diagnostics**
  - Syntax errors: stray tokens, unterminated strings, unknown escapes.
  - Undefined names inside expressions and `emb`/`res` values.
  - Constants used before their `def` or after their `undef`.
  - Immediates used as destinations, and non-scalar types in `res`.
  - Unresolved `@name-` / `@name+` references.
- **Hover** now shows constant values (evaluated), `##` doc comments above a label, and the
  file a symbol comes from.
- Settings `mnemonimov.userProjectsPath` and `mnemonimov.sampleProjectsPath` (auto-detected
  when empty).
- Command **Mnemonimov: Restart Language Server**.
- Unsaved (`untitled:`) documents get language support.

### Changed

- Instructions and directives are only highlighted at the start of a statement, so a label
  named like a keyword (e.g. `res`, `max`) is no longer colored as one. `string` and `file` are
  only highlighted after `emb`, and `icast`/`fcast` are highlighted as operators.
- Toggle Comment now inserts `#` (it inserted `//`), and pressing Enter in a `##` doc comment
  continues it.

### Fixed

- Reusable label references (`@loop-`, `@end+`) now resolve to the right definition, for
  go-to-definition and references.
- Forward references to qualified local labels (`jmp DATA.end`) are no longer reported as unknown.
- Closing a file clears its diagnostics.
- Signature help works after a `label:` and with tab indentation.

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
