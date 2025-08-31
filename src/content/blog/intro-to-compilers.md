---
title: "Introduction to Compilers"
date: 2025-08-5
description: "An overview of the compiler pipeline"
---

## What is a compiler

By definition a compiler is a program which can read program from a source language and converts it to another language the target. The main aspect of a compiler is that it preserves the meaning of input program. In general a compiler does not directly produce machine code, instead it produces assembly code and then uses an assembler to create the executable.

## Compiler pipeline

A compiler usually works in several sequential stages. Each stage transforms the program representation and prepares it for the next stage. Compiler are typically split into two phases, the frontend and the backend.

![Frontend](/blog-assets/compiler-front-end.png)
![Backend](/blog-assets/compiler-back-end.png)

### Lexer

The **lexer**, or **scanner**, converts raw source code into a sequence of **tokens**.  

- Tokens are atomic elements like keywords, identifiers, operators, and literals.  
- Removes whitespace and comments.  

For example:

```c
int x = 42;
```

would be converted into the tokens:

```css
[int] [identifier:x] [=] [number:42] [;]
```

### Parser

The parser takes tokens from the lexer and builds a parse tree or abstract syntax tree (AST).

- Ensures the code follows the language grammar.
- Detects syntax errors such as missing semicolons or unmatched brackets.

again using the example of

```c
int x = 42;
```

the AST produced might be something like:

```yaml
Assignment
 ├─ Variable: x
 └─ Value: 42
```

### Semantic Analysis

Semantic analysis checks the meaning of the program.

- Type checking (e.g., cannot assign a string to an integer).
- Scope resolution (variables must be declared before use).
- Ensures the program is logically correct.

Errors caught at this stage:

- Type mismatch
- Undeclared variables
- Invalid function calls

### Intermediate Representation (optional)

Some compilers then generate an **intermediate representation (IR)**, which is a lower-level, platform-independent version of the program. The IR makes it easier to apply optimizations and eventually generate target-specific assembly code

#### LLVM

The LLVM framework, for example, uses an IR that allows multiple programming languages to be compiled efficiently for different architectures, while also enabling advanced optimizations.

### Optimisation

Optimizations improve program efficiency without changing its behavior. They can make code execute faster, use less memory, or reduce other resources. Even basic optimizations can have a significant impact.

#### Constant Folding

Constant folding evaluates expressions at compile time, so an expression such as

```c
int x = 2+3;
```

would be directly replaced at compile time with the expression

```c
int x = 5;
```

#### Dead Code Elimination

Dead code elimination removes instructions that will never be executed, such as code after a return statement.

### Assembly Code Generation

The final stage translates the intermediate representation (or AST) into assembly code specific to the target CPU architecture.

- Assigns registers and memory locations.
- Converts operations to CPU instructions.
- Prepares the program for linking into an executable.
