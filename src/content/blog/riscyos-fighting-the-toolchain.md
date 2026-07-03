---
title: "Making RiscyOS: Fighting the Toolchain"
date: 2026-07-03
description: Every operating system needs a toolchain before it needs a scheduler. In the first part of this series, I explain how I got GCC working with my university's rather unusual RISC-V toolchain.
tags:
  - OS
  - Assembly
  - Embedded
  - RISC-V
project:
  name: "RiscyOS"
  slug: "RiscyOS"
series:
  name: "Making RiscyOS"
  part: 1
  total: 1
featured: true
---

This semester I took the microcontrollers module (COMP22712). The final assignment (Exercise 9) was an open-ended project, and naturally I decided to build yet another operating system. This post is really about the first obstacle: building a toolchain that would make my life a lot easier.

This time I had access to more powerful hardware and most importantly interrupts. In a massive leap from [STUMP](/blog/building-stump-os-coursework) (my previous attempt at a kernel), the specs of the hardware I had access to were:
- RISC-V 32-bit core (40MHz)
- 32 PIO pins
- LCD display
- 4 Buttons
- UART Communication for terminal
- 16 KiB of Kernel RAM (BRAM)
- 256 KiB of User RAM (BRAM)
- 1 MiB Framestore
- A clock peripheral as well as the RISC-V system timer

At the very start of the module before I had even touched the new hardware and completed the very first exercise I opened up my notes app and wrote my end goals:
```
Final outcome:  
- A shell / mini os which
- ls, cat, touch
- this means that dynamic loading is needed to run programs
```

Unfortunately, I didn't manage to achieve all of these goals by the end of the project. What I did achieve though was dynamic loading, a read-only file system, a shell / tty, process scheduling, forking and process isolation. 

## Toolchain Problems

 One of my goals for this project was to be able to write parts of the operating system in C and integrate them with the rest of the codebase, which was written entirely in hand-written assembly. The main reason why I wanted to do this is because I really did not want to write extremely complex functions like the FAT file system driver or the ELF parsing in pure assembly.  This proved to be more difficult than it would have been on a conventional system. The university's debugging environment uses its own executable format, [KMD](https://brej.org/kmd/), together with a custom assembler. This meant that I could not directly just combine GNU-Assembly [GAS](https://sourceware.org/binutils/docs/as/) with my hand written assembly and let the assembler handle everything. Here are some quirks that the custom assembler had:
- Uses `LA` for loading addresses instead of the standard `LUI`/`ADDI` sequence.
- Uses `[]` for memory operands instead of the standard `()`.
- Uses Z80-inspired directives such as `DEFW`, `DEFS`, and `DEFB`.
- Supports numeric local labels (`1`, `2`, etc.), referenced using `%(F|B)<number>`.

There were several ways I could have approached this problem. I could have rewritten the assembly to conform to GAS and used the GNU assembler, rewritten the entire project in C, or compiled everything to raw binaries and injected them into the KMD format. Instead, I chose to be quite stupid though and decided to write a python script which translated GAS into Jim assembly. 

In practice, this worked surprisingly well, although it introduced a handful of frustrating edge cases. The biggest limitation was translating global variable declarations and compiler-generated jump tables correctly. Instead of hacking my way though I just simply gave up and decided to avoid using the language features. 

Another issue came from the compiler being _too_ clever. My translator assumed that the standard RISC-V sequence for loading a 32-bit address would always appear as two consecutive instructions using the same registers:

```asm
# Standard GNU Assembly (GAS)       ; Custom "Jim" Assembly
lui  t1, %hi(msg)                    la t1, msg
addi a0, t1, %lo(msg)                
lw   t2, 0(a0)                       lw t2, [a0]
.word 0xDEADBEEF                     msg DEFW 0xDEADBEEF
```

Sometimes, the compiler would keep the result of the `LUI` alive across other instructions:

```asm
lui  t1, %hi(SOME_LOCATION)
# Instructions that use or preserve t1
addi t1, t1, %lo(SOME_LOCATION)
```

or even use a different destination register for the final `ADDI`:

```asm
lui  t6, %hi(SOME_LOCATION)
# Instructions that use or perserve t6
addi t3, t6, %lo(SOME_LOCATION)
```

I did eventually get these cases working, but the solution is decidedly hacky. It works well enough for this project, but it's a brittle approach that would likely break if the compiler started producing substantially different code. 

## My Solution
My script parsed the compiler's GNU Assembly output into a custom Intermediate Representation (IR) consisting of structured `Module`, `Function`, `Instruction`, and `Operand` node primitives.

This allowed me to implement a stateful, compiler like peephole optimisation pass which walks the instruction stream of each function body and collapses the sequences into the target `la` pseudo-instruction.

The core difficulty stemmed from three distinct classes of symbol resolution that the compiler generates: static local symbols via global anchors (`.LANCHOR`), anonymous string literal constants from the module's string table, and external symbols.
<div style="border-left: 4px solid #00ABE4; padding: 1rem; background-color: #1f1f1f; border-radius: 8px;">
  <strong>Note:</strong> I would later discover that the generation of .LANCHOR was not consistent and it sometimes would anchor around a variable and I didn't want to deal with this which is why I ultimately didn't use global variables in C.
</div>

```python
# Pass snippet: Tracking and collapsing interleaved lui + addi pairs
LA_MAPPED = {}
while i < len(body):
    node = body[i]
    if isinstance(node, Instruction) and node.op == "lui":
        d1 = node.dest()
        hi = node.src(1)
        
        # Track active symbol-to-register allocations in the current block
        if hi and str(hi).startswith(".LANCHOR"):
            # Resolve localized offset mappings from the compiler's anchor map
            LANCHOR_ENTRY = LANCHOR_MAP[hi.symbol]
            LA_MAPPED[hi.symbol] = d1
            hi.symbol = LANCHOR_ENTRY[0]
        ...
        
        # Generate the unified 'la' pseudo-instruction for the target architecture
        la = Instruction(op="la", operands=[d1, hi])
        out.append(la)
```

By maintaining a tracking dictionary (`LA_MAPPED`) per function, the pass actively caches which symbol upper-bits are currently live in which destination register.

This state tracker becomes essential further down the instruction stream. When the compiler interleaves operations or schedules the corresponding lower-bit `ADDI` operation multiple cycles late, the pass intercepts the delayed instruction. It verifies whether the source registers match a previously cached `LUI` symbol mapping:

```python
if node and isinstance(node, Instruction) and node.op == "addi":
    if node.src(2).kind not in [OperandKind.REGISTER, OperandKind.IMMEDIATE]:
        dest_reg = LA_MAPPED.get(node.src(2).symbol)
        
        # Scenario A: Standard delayed pair using matching registers -> Safe to eliminate
        if dest_reg.reg == node.dest().reg and dest_reg.reg == node.src(1).reg:
            i += 1
            continue
            
        # Scenario B: Interleaved callback register mismatch -> Emit a corrective 'mv'
        elif dest_reg.reg == node.src(1).reg:
            mv_offset = Instruction(op="mv", operands=[node.dest(), dest_reg])
            out.append(mv_offset)
            i += 1
            continue
```

In standard RISC-V, an `lui` instruction loads an immediate value into bits 31–12 of the target register, leaving the lower 12 bits cleared to zero. The compiler expects this register to contain _only_ the upper portion of the address during any interleaved operations, until the corresponding `addi` finally sweeps in to calculate the exact address.

My pass breaks this assumption entirely. The moment it encounters an `lui`, it aggressively expands it into an `la` pseudo-instruction. This forces the destination register to hold the **entire 32-bit absolute address** immediately. Later down the line, when the pass intercepts the delayed `addi`, it replaces it with a `mv` (Move) instruction to pass that full address along to the final destination register.

```
--- Standard GCC Expectation ---
lui t6, %hi(sym)    -> t6 = Upper 20 bits only (Lower 12 bits are 0x000)
#Interleaved Ops    -> Can perform arithmetic relative to page/anchor boundary
addi t3, t6, %lo    -> t3 = Full 32-bit calculated target address

--- My Peephole Pass Overrides ---
la t6, sym          -> t6 = Full 32-bit absolute address immediately!
#Interleaved Ops    -> !!! RUNNING WITH FULL ADDRESS !!!
mv t3, t6           -> Copies full address to final destination
```

This is where the engineering compromise lives. By loading the full address up front, I am implicitly assuming that none of the interleaved instructions depend on that register holding _only_ the masked upper bits.

For my kernel code, this pragmatism held up: the scheduled instructions between the pair were merely preserving the register or loading independent values. However, in a generalised toolchain, this assumption is highly volatile. If the compiler attempted to use that intermediate register to calculate a structure offset relative to an alignment boundary before the `addi` executed, the math would completely blow up and who knows maybe the board would as well...

## Putting it all together

With this in place I could create a Makefile which would orchestrate everything and produce a final clean output. Here is how it worked:

- It would find all C files within the source folders I specified
- Make a \_build folder where all of the converted asm files would live
- Compile C -> GAS using the gcc-riscv toolchain
- Run the script to convert GAS -> Jim Assembly
- Generated a top-level file in the \_build directory which `#include` all of the translated assembly
- Runs the C pre-proccessor on the main.s file which produced a singular file with all of the source code
- Compiled the Jim Assembler (if needed)
- Ran the assembler on the output and produced a kmd file ready to use on the hardware.

<details>
  <summary style="cursor: pointer;">View Makefile</summary>
  <p>

```Makefile
# Top-level Makefile

# Compiler
CC = gcc

RISCV_PREFIX ?= riscv64-unknown-elf
RISCV_CC = $(RISCV_PREFIX)-gcc  # your RISC-V cross-compiler

# Paths
ASSEMBLER_DIR = tools/assembler
RVA_SRC = $(ASSEMBLER_DIR)/rva.c
RVA_BIN = $(ASSEMBLER_DIR)/rva

MAIN_SRC = main.s
OUT_PRE = out.s
OUT_DIR = out

# Build folder for compiled assembly
BUILD_DIR = _build

# Default: run conversion
SKIP_CONVERT ?= 0

# All C sources in kernel, drivers, and user
C_SRCS := $(shell find kernel drivers sys arch boot -name '*.c')
S_SRCS := $(patsubst %.c,$(BUILD_DIR)/%.s,$(C_SRCS))
S_CONV_SRCS := $(patsubst %.c,$(BUILD_DIR)/%.out.s,$(C_SRCS))

# Default target
all: $(RVA_BIN) assemble

# Compile rva if needed
$(RVA_BIN): $(RVA_SRC)
	$(CC) $< -o $@

# Compile C -> RISC-V assembly in _build folder
$(BUILD_DIR)/%.s: %.c
	@mkdir -p $(dir $@)
	# -Oz optimise aggressively for size
	$(RISCV_CC) -Oz -S -ffreestanding -nostdlib \
			-march=rv32im_zicsr -mabi=ilp32 \
			-fno-pic \
			-mno-relax \
			-fno-asynchronous-unwind-tables \
			-fno-exceptions \
			-fno-ident \
			-fno-jump-tables \
			-fverbose-asm \
			-I include \
			$< -o $@

# Generate include aggregator for all generated .s files
$(BUILD_DIR)/all_includes.s: $(S_SRCS)
	@mkdir -p $(BUILD_DIR)
	@echo "; Auto-generated include list for all .s files" > $@
	@for f in $(filter-out $(BUILD_DIR)/user/%,$(S_CONV_SRCS)); do \
	    echo "#include \"$${f#$(BUILD_DIR)/}\"" >> $@; \
	done

# Build all _build/*.s files from .c
.PHONY: compileC
compileC: $(S_SRCS)
	@echo "Compiled all C sources to .s files"

.PHONY: convert
convert: compileC
ifeq ($(SKIP_CONVERT),0)
	@for f in $(S_SRCS); do \
	    echo "Converting $$f..."; \
	    python3 tools/gas-to-jim/convert_generated_asm.py "$$f"; \
	done
else
	@echo "Skipping conversion step"
endif

# Preprocess main.s (always runs) – now depends on convert
.PHONY: preprocess
preprocess: convert $(BUILD_DIR)/all_includes.s
	@echo "Preprocessing main.s..."
	$(CC) -E -x assembler-with-cpp -P $(MAIN_SRC) -I include | \
	sed 's/__NL__/\
/g' | sed 's/tail /j /g' > $(OUT_PRE)

# Run assembler (must run from assembler dir)
assemble: preprocess
	@mkdir -p $(OUT_DIR)
	$(MAKE) -C $(ASSEMBLER_DIR) run-rva \
		OUT_DIR=$(abspath $(OUT_DIR)) \
		OUT_PRE=$(abspath $(OUT_PRE)) \
		FORMAT=$(FORMAT)

# Clean generated files
.PHONY: clean
clean:
	rm -f $(OUT_PRE)
	rm -rf $(BUILD_DIR)
	cd $(ASSEMBLER_DIR) && rm -f rva
	rm -rf $(OUT_DIR)
``` 
</p>
<div style="border-left: 4px solid #00ABE4; padding: 1rem; background-color: #1f1f1f; border-radius: 8px;">
  <strong>Note:</strong> The sed tail was because the assembler had a bug where it would produce the opcode for call (JAL <label>, ra) instead of tail (JAL <label>, zero).
</div>
</details>

The remainder of the project wasn't built in a neat linear order. Some components, such as the exception handler and interrupt support, were developed as part of earlier coursework exercises and were gradually expanded into the kernel. Rather than following the exact chronology, I want to cover the system by subsystem. One of the first things I needed was external storage.