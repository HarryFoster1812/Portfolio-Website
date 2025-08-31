---
title: "Introduction to NASM assembly"
date: 2025-08-5
description: "An overview of assembly as a language the NASM ISA and how to write basic programs"
---

## What is assembly

Assembly language is a low-level programming language that provides a human-readable representation of machine code. Each instruction corresponds directly to an operation performed by the CPU, making it highly efficient but also more difficult to write and maintain than high-level languages like C or Python.

## Assembly Pros and Cons

## NASM

NASM (Netwide Assembler) is an assembler for the x86 architecture. It is widely used due to its simplicity and support for flat binary, ELF, and other output formats.

## Intel vs AT&T

There are two main syntaxes for x86 assembly:

### Intel syntax (used by NASM)

- Destination comes first: `mov eax, 1`
- Readable and intuitive for most beginners

### AT&T syntax (used by GNU assembler)

- Source comes first: `movl $1, %eax`
- Uses `%` for registers and `$` for constants

NASM exclusively uses Intel syntax.

## NASM directives

Directives are instructions for the assembler rather than the CPU. Common NASM directives include:

- `section` — defines sections of code (`.text`, `.data`, `.bss`)
- `global` — exposes symbols to the linker
- `db` `dw`,`dd` — define bytes, words, and double words in memory
- `equ` — define constants

## The most basic program

The most basic program we can write in assembly does absolutely nothing. It just exits. This is the code for that program:

```asm
section .text
global _start

_start:
    mov rax, 60   ; syscall number for exit
    mov rdi, 0    ; exit code
    syscall       ; make the system call
```

### Notes

- _start is the entry point of the program.
- rax holds the syscall number (60 = exit on Linux x86-64).
- rdi holds the exit code (0 here). The value in rdi determines the exit status of the program.

To assemble and run this:

```bash
nasm -felf64 path/to/file.s && ld path/to/file.o
./path/to/file
```
