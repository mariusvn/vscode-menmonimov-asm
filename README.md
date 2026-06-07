# Mnemonimov Assembly — Syntax Highlighting

VS Code syntax highlighting for **MISA** (the Mnemonimov Instruction Set Architecture), the custom assembly language used in the [Mnemonimov](https://mnemonimov.com/) fantasy console.

---

## Features

Provides full syntax highlighting for `.mnemo` and `.asm` files, covering the complete MISA instruction set:

- **Instructions** — all arithmetic, floating-point, vector, logic/bitwise, bit-manipulation, data-transfer, control-flow, drawing, and system instructions
- **Registers** — general-purpose (`t0`–`t15`, `a0`–`a15`, `s0`–`s31`) and special-purpose (`zr`, `cr`, `ea`, `pa`, `ba`, `sp`, `fp`, `pc`)
- **Directives** — `def`, `undef`, `emb`, `res`, `bmk`, `sbmk`
- **Types** — `i8t`, `u8t`, `i16t`, `u16t`, `i32t`, `u32t`, `f32t`, `string`, `file`
- **Comparison conditions** — `eq`, `neq`, `lt`, `lte`, `gt`, `gte`, `ltu`, `lteu`, `gteu`, `feqa`, `fneqa`, `flt`, `fgt`, `fnan`, `finf`
- **System calls** — all `SYS_*` identifiers (`SYS_PRINT_STRING`, `SYS_DRAW_TEXTURE`, `SYS_GET_INPUT`, …)
- **Built-in symbols** — `true`, `false`, `PI`, `TAU`, `EXP1`, `INF`, `NAN`, `SCREEN_WIDTH`, `SCREEN_HEIGHT`, `BTN_*`, `$`
- **Numeric literals** — decimal, hexadecimal (`0x`), binary (`0b`), octal (`0o`), floating-point, with underscore separators
- **String literals** — double-quoted strings with escape sequences
- **Labels** — global (`name:`), local (`.name:`), and reusable (`@name:` / `@name+` / `@name-`)
- **Comments** — regular (`#`) and documentation (`##`)
- **Expression operators** — arithmetic, bitwise, logical, and vector range (`..`)

---

## File Extensions

| Extension | Language |
|-----------|----------|
| `.mnemo`  | Mnemonimov Assembly |
| `.asm`    | Mnemonimov Assembly |

---

## Requirements

No external dependencies. Works out of the box with any VS Code theme.

---

## Known Issues

None at this time.

---

## Release Notes

See [CHANGELOG](CHANGELOG.md) for the full history.
