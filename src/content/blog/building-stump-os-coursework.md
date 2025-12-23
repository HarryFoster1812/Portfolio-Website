---
title: "Building StumpOS for COMP22111."
date: "2025-12-15"
description: "An insight into the design, implementation, and learning process for StumpOS"
tags:
  - OS
  - Assembly
  - Embedded
  - STUMP
  - Systems Programming
project:
  name: "StumpOS"
  slug: "stumpos"
featured: true
---

## Building StumpOS for COMP22111

STUMP OS is a semi-fully functional, from-scratch operating system (of sorts) written in pure assembly for the University of Manchester's STUMP teaching board, which were nine years old at the time of writing.

I want to start this off with a very bad joke:

**Why was the assembly code so stressed?**
Because it couldn't handle all the instructions.

## Constraints of STUMP

To begin, I want to walk you through all of the limitations that were placed upon us.

### The ISA

The STUMP ISA (which I was given) is deliberately minimalistic. It provides only **six general-purpose registers** (R1-R6), with R0 hardwired to zero and R7 acting as the program counter (PC). This setup severely limits the number of temporary values that can be held simultaneously.

On top of this, as it is a 16-bit processor, immediate values are restricted to **5-bit two's complement constants** (-16 to 15). This made arithmetic and memory operations significantly more challenging. The processor, designed in Verilog, does not have a barrel shifter, so the ISA supports only **single-shift operations per instruction**.

There is a dedicated, inaccessible flag register, which is updated using the {s} variant of the arithmetic operations. The ISA uses this flag register for conditional branching. The four flags are:

* Z (Zero)
* C (Carry)
* V (Overflow)
* N (Negative)

### Memory

STUMP is limited in memory, giving us only the range from 0x0000$ to 0x1FFF to use. Writing beyond this range caused the assembly runtime environment we were using (Bennett) to zero the written data. The memory we used was word-sized (each address stored 16 bits), which was quite convenient and slightly mitigated the memory limitations.

### Peripherals and Hardware Limitations

In addition to the tight register and memory constraints, STUMP's peripheral and hardware design imposed further challenges. The board provided only a handful of peripherals, which were memory-mapped from 0xFF00$ onwards. We had access to the following:

* An LED Matrix (8x8 with 8-bit colour: RRRGGGBB)
* LCD Screen (4x20)
* Buzzer (programmable for playing single notes)
* Keypad (0–9, \#, and * buttons)
* Switches (A–H with LEDs on top)
* Vibration motor (just on or off)
* Real-time clock
* A free-running counter

All of the drivers and implementations can be found here: [STUMPOS/peripherals](https://github.com/HarryFoster1812/StumpOS/tree/master/Peripherals).

A major challenge came from **switch and keypad inputs**. Since the boards were nine years old at the time, electrical leakage often caused unreliable bit patterns (e.g., pressing switch E might also register switch D simultaneously).

There were no advanced debugging tools or simulators; the only way to fully test code was on the physical board itself, which made iterative development slow and error-prone. I spent a full week sitting in the lab from 10 AM to 9 PM. For this coursework, it was a universal experience to spend hours writing mountains of assembly code at home, only to be greeted by dozens of assembler errors before anything could be tested on the board.

## Getting Around the 5-Bit Immediate

One of the early challenges I encountered was the **very limited immediate range** of the STUMP ISA. Since constants in instructions can only be 5-bit two's complement (-16 to 15), any larger value cannot be encoded directly in a single instruction. This limitation affects memory addresses, offsets, and even simple arithmetic operations.

The primary technique I used to work around this was **tables**. By precomputing values or storing addresses in memory, I could load them indirectly using **base + offset addressing**. For example, instead of trying to load the absolute address of a peripheral directly into a register, I would create a table of addresses and use a small offset within the 5-bit range to index it. This effectively bypassed the immediate restriction without needing extra registers or multiple instructions for every constant.

## Macros Make Development Easier

One thing that frustrated me last year was the requirement to keep all assembly code in a single file. This year, I vowed to find a workaround, and I did. By leveraging the C preprocessor, I was able to handle `##include` directives and split things up into different files. This also allowed me to create **macros**, which made development much more manageable.

Many people dislike macros because they can be hard to read, but for this project, they were a lifesaver. There was a lot of repetitive code, such as pushing and popping values off the stack or calling functions. With macros, I could maintain a single implementation, and if I made a mistake, I only needed to update the macro rather than trudging through hundreds of lines of assembly. Macros also allowed me to rename registers for readability. For example, I used `NULL` instead of r0, sp instead of r6, and pc instead of r7 throughout some of the code.

There were some limitations, though:

* Macros don't automatically add newlines, so formatting required extra care.
* Since macros have no runtime checking, I needed separate macros for operations involving high addresses, such as setting the correct syscall index.

It was a little annoying to have to run the compile script every time, especially because it took about a minute to upload onto the board.

Here was my compile script:

```bash
gcc -E -x assembler-with-cpp -P STUMPOS.s |
  sed 's/__NL__/\
/g' | 
sed 's/__HASH__/#/g' \
  > out.asm
```

All the script does is: `gcc -E -x assembler-with-cpp -P STUMPOS.s` expands all macros and resolves `##include` directives. Then, `sed` replaces placeholders like `__NL__` with actual newlines and `__HASH__` with \#, producing a clean `out.asm` file ready for the assembler.

## Ok, Onto the Actual Project

At the beginning, we were all trying to come up with ideas that would get the most marks. Here are a few projects that other people made:

* *Flappy Bird*
* *Tetris*
* *Piano Tiles*
* A music waveform visualiser
* *Conway's Game of Life*
* Reaction time games

I was originally considering making a chess game until someone jokingly asked, "Why don't you make an OS?" And I thought… well, why not? That's how StumpOS was born.

## Planning

Just like with any project, the first step I took was planning. Armed with only my knowledge from the operating systems course unit last year, after countless hours of consulting with ChatGPT, reading online discussions about OS development, and watching YouTube videos, I came up with a plan.

Here was the very first version:

```
- Memory Layout:
    - User code/data: 0000–3FFF
    - Kernel globals: 4000–47FF
    - PCB table: 4800–4FFF
    - Kernel heap: 5000–5FFF
    - Kernel code: 6000–BFFF
    - Buffers/drivers: C000–F000
    - Peripherals: FF00–FFFF
      
- Process Management  
    - Each process has a PCB storing registers, SP, PC, state, and stack base
    - 4 concurrent user processes (static)
    - Scheduler: simple cooperative round-robin triggered by `SYS_YIELD`
    - 4 stacks pre-reserved and allocate first available
      
- Context Switching
    - Save/restore r1–r5, SP, and PC      
    - Implemented as a small routine in kernel code
      
- Syscall Interface  
    - Syscall table stored in kernel globals
    - Basic syscalls: `SYS_YIELD`, `SYS_EXIT`, `SYS_WRITE`, `SYS_READ`
      
- Heap & Memory Management
    - Kernel heap (5000–5FFF)
    - Simple bump allocator or free-list strategy
      
- Drivers & Buffers  
    - Mapped at C000–F000

```

I made a lot of changes from this first version of the plan. Notably, I wanted to use memory addresses higher than 0x1FFF, which I later found out was impossible due to hardware constraints. This forced me to rethink everything. I even considered switching projects because of the severe memory constraints.

On my commute home, I opened up my notes app and wrote:

> New Memory Plan:
> Have one massive heap and then just use `malloc` and `free` on everything.
> Need a new process? Malloc it. Need a new Stack? Malloc it.
> Maybe have a dedicated kernel stack which is 64 words.

This is admittedly a terrible idea because if one process corrupted heap memory, it could crash the entire system.

## Implementing the Heap

Knowing what I needed to do, I spent a day (and a few hours in the pub before a social) creating malloc and free.

After some research online, the easiest heap implementation would be a **header-based heap**:

```c
typedef struct block_header {
    uint16_t size;    // payload size
    uint8_t  is_free; // 1 = free, 0 = used
    uint8_t owner_pcb;
} block_header_t;
```

The idea is straightforward: each memory block has a small header storing its size, whether it's free, and which process owns it. In the boot code, I would assign the first block to be the size of the entire heap.

```c
void* sys_malloc(uint16_t size)
{
    uint8_t *p = (uint8_t*)HEAP_START;

    while (p < HEAP_END) {
        block_header_t* h = (block_header_t*)p;

        if (h->is_free && h->size >= size){
            if(h->size-size-sizeof(block_header_t) > 0){
                // split the next one
                (p+size+sizeof(block_header_t))->size = h->size-size-sizeof(block_header_t);
                (p+size+sizeof(block_header_t))->is_free = 1 // it is free

            }

            h->is_free = 0;
            return p + sizeof(block_header_t);
        }

        // move to next block
        p = p + sizeof(block_header_t) + h->size;
    }

    return 0; // no space
}
```

`sys_malloc` works by **scanning the heap** from the start, looking for the first free block that fits the requested size. If the block is larger than needed, it **splits the block** into an allocated piece and a smaller free block for the remainder.

```c
void sys_free(void *ptr)
{
    if (!ptr) return;

    block_header_t *h = (block_header_t*)((uint8_t*)ptr - sizeof(block_header_t));
    h->is_free = 1;

    // merge with next if free
    uint8_t *next_addr = (uint8_t*)h + sizeof(block_header_t) + h->size;
    if (next_addr < HEAP_END) {
        block_header_t *next = (block_header_t*)next_addr;
        if (next->is_free) {
            h->size += sizeof(block_header_t) + next->size;
        }
    }
}
```

When free is called, the block is marked as free, and the **next adjacent block** is checked to see if it can be merged, helping to reduce fragmentation. This is a very **simple coalescing strategy**; a more sophisticated approach like eager coalescing would be better, but for the scope of this project, this was sufficient and kept the implementation manageable.

This was one of the very first pieces of code I wrote, which is why it was originally written in C then translated into assembly. This was a good process but very time-consuming, which is why I opted not to do it again.

## Context Switching

With the heap in place, the next challenge was allowing the kernel to execute code safely without overwriting user data. This is where **context switching** comes in. Context switching is the process of saving the current state of a user process its registers, stack pointer, and program counter so that the kernel can run its own code. Once the kernel has finished, the saved state can be restored, allowing the user process to resume execution exactly where it left off.

As mentioned previously, I don't have a return register, so the return address is pushed onto the stack.

Here is my implementation of the context switch:

```asm
; this is to switch either from program to sys_state or from sys_state to program
sys_context_switch:
 PUSH(r1) ; if in sys_state this is the return item else it is sys input
 PUSH(r2)
 ld r1, [r0, ##kernel_pcb_pointer]
 ld r2, [r1, ##1] ; r1=is_sys_state
 cmp r2, r0
 bne switch_to_user  ; if !is_sys_state
 
  ; flip is_sys_state
  add r2, r0, ##1
  st r2, [r1, ##1]
  ld r1, [r0, r1]
  POP(r2)
  
  ; user -> kernel state
  ; r1 = kernel_stack
  add r1, r1, ##5
  st r5, [r1] ; store sys_return for the end of function
  POP(r5) ; r5 is r1  from the push
  sub r1, r1, ##4
  sub r6, r6, ##1
  st r6, [r1] ; store user sp
  mov r6, r1 ; sp is now kernel_sp
  add r6, r6, ##4
  PUSH(r5) ; store r1 at the top of kernel_sp
  sub r6, r6, ##5
  PUSH(r4) 
  PUSH(r3) 
  PUSH(r2) 
  add r6, r6, ##2
  POP(r1)
  return_macro
 
 switch_to_user: 
  ; flip is_sys_state
  st r0, [r1, ##1]
  ld r1, [r1]
  POP(r2)
  
  ; kernel -> user
  ; r6 = kernel_stack
  POP(r1)
  POP(r2)
  POP(r3)
  POP(r4)
  POP(r6)
  return_macro
```

My approach is a bit of a cheat: I store all the registers onto the kernel stack, and because of how the stack is structured, the return address is already there. By manipulating the **stack pointer (r6)**, the CPU switches between the **kernel stack** and the **user stack**. For example, when switching from user to kernel mode, the current user stack pointer is saved into the PCB and r6 is set to the kernel stack. When switching back, r6 is restored to the saved user stack, so the user process resumes execution correctly.

In a real system, there would be a **special register indicating privilege mode**, but StumpOS doesn't have that. Instead, I use an **internal flag** (`is_sys_state`) to track whether the CPU is currently executing in **kernel mode** (1) or **user mode** (0).

### Stack Diagrams

When a process is running in **user mode**, its stack (r6) is organised as follows:

```
+----------------------+
| syscall return addr  |  <- stored in r5 during syscall
| user return address  |  <- where to resume after syscall
| r5 (optional)        |  <- temporary value of r5
| <OLD>                |  <- previously saved values
| BASE                 |  <- Stack Base
+----------------------+
```

When switching to kernel mode, I pop the syscall return address, making the head of the stack the user return address, and switch to the kernel stack, which looks like this at the end of the context switch:

```
+----------------------+
| r2                   |  <- User r2 before context switch
| r3                   |  <- User r3 before context switch
| r4                   |  <- User r4 before context switch
| User SP              |  <- previous stack  pointer
| BASE                 |  <- Stack Base
+----------------------+
```

The reason r1 is not stored is because r1 holds the return result from the system.

## Syscalls

Now that we have context switching and a heap, the kernel can safely execute functions that modify registers or memory without affecting user processes. However, we need a way for user programs to request these kernel services. This is where **system calls** (syscalls) come in.

A system call is an interface that allows a user program to request the operating system to perform a task on its behalf. This task is something the program cannot safely or directly do itself, such as allocating memory, writing to a display, or interacting directly with hardware. The system call mechanism ensures that the kernel can execute these operations in a privileged, isolated context while maintaining the safety and state of the user process.

Here is my sys\_call function:

```asm
sys_call:
 CALL(sys_context_switch)
 add r5, pc, ##4
 PUSH(r5)
 ld r5, [r0, ##sys_table_pointer]
 ld pc, [r5, r4] ; call the corresponding function
 bal sys_context_switch
```

First, it calls the context switch function, which gives the requested function an isolated environment. Then, it calculates the return address, calls the requested function, and then switches back to the user process.

The full table of all system calls implemented can be found [in the docs](https://github.com/HarryFoster1812/StumpOS/blob/master/docs/Syscall_docs.md).

## Scheduling

With system calls and context switching in place, the next challenge was managing multiple processes. Each process has a **Process Control Block (PCB)**.

```c
PCB_entry {
 Sate (ENUM{waiting, paused, running}),
 u16 r1,
 u16 r2,
 u16 r3,
 u16 r4,
 u16 r5,
 void* SP,
 void* code_start,
 void* stack_base,
 void* next_pcb,
 bool request_foreground
}
```

StumpOS uses a **simple cooperative scheduling** model. Each process runs until it voluntarily calls `SYS_YIELD`, which invokes the scheduler and switches to the next process. The PCB list is implemented as a **circularly linked list**, making **round-robin** scheduling straightforward: the scheduler simply follows `next_pcb` pointers until it finds the next process in the waiting state.

A **pre-emptive scheduler** would be more robust and fair. In this model, each process is given a fixed time slice and automatically interrupted when it expires, enforcing fairness across all processes. This is what modern operating systems use, but it relies on a **hardware timer and interrupts**, which the STUMP board did not provide. Without those, cooperative scheduling was the only practical solution for StumpOS.

## Peripheral Arbitration

One recurring problem was **peripheral management**. Since multiple processes could be running at the same time, I needed a way to ensure that only **one process could access a peripheral at once**. Without this, two processes could try to write to the same peripheral, such as the LCD screen, simultaneously.

This is where I borrowed the idea of **mutexes**. A mutex (mutual exclusion) is a simple synchronization mechanism that allows **exclusive ownership** of a resource. At any given time, only one process can hold the mutex for a peripheral, and all other processes must wait until it is released. In StumpOS, this provided a straightforward way to arbitrate access to hardware devices and prevent processes from interfering with each other.

However, this wasn't quite what I wanted. Once a process released a peripheral, I wanted control to return to the **previous owner**, rather than allowing any waiting process to acquire it arbitrarily. To achieve this, I modified the mutex into a **stack-based system**, where ownership is pushed and popped. This allowed peripherals to behave more like a scoped resource: when a process finished using a device, the peripheral would automatically revert to the process that had owned it before.

Each peripheral is backed by its own **mutex stack**, implemented as a small fixed-size array in memory. These stacks store the **PCB IDs of processes** that currently own (or previously owned) the peripheral. The top of the stack represents the **current owner**, while any entries below it represent suspended owners waiting to regain access.

The `mutex_table` acts as a lookup structure for all peripherals. For each mutex, it stores:

* A pointer to the **base of the stack**
* A pointer to the **current head** of the stack

When a process requests access to a peripheral, its PCB ID is **pushed onto the corresponding mutex stack**, and the head pointer is advanced. If the peripheral is already owned, the requesting process blocks until it reaches the top of the stack. When a process releases the peripheral, its entry is **popped**, and ownership automatically returns to the previous process beneath it.

This also relies upon co-operation to make the system effective. In each process, at the start of the execution loop, the process must check if it has access to the peripherals before using them:

```asm
    add r1, r0, ##LCD
    add r4, r0, ##sys_check_claim_func
    SYSCALL()
    cmp r1, r0
    beq skip_draw

    add r1, r0, ##BUTTONS_SW
    add r4, r0, ##sys_check_claim_func
    SYSCALL()
    cmp r1, r0
    beq skip_draw
```

One limitation of this approach became apparent: once a process voluntarily released its claim on a peripheral, there was no automatic way for it to reclaim foreground ownership later. To solve this, I extended the PCB with a `has_foreground` flag. This flag is set by the boot loader and indicates that the user wants the process to run in the foreground.

During the process's main loop, the flag is checked. If the process wants the foreground and does not currently own the necessary peripherals, it will attempt to reclaim them. This allows foreground applications to regain control deterministically while still preserving cooperative multitasking and preventing peripheral contention.

## Boot Manager

The **boot manager** was the first "user process" I implemented, and it is also the **very first process created at startup**. Rather than being hard-coded into the kernel, it runs like any other user program, which made it a useful testbed for process creation, scheduling, and peripheral arbitration.

The boot manager provides a **simple paging interface** that allows the user to scroll through all available programs installed on the system. From this interface, the user can:

* **Boot** a program
* **Pause** a running program
* **Kill** a process entirely

To present this information, the boot manager uses the **LCD display**. For each program, it shows:

* The **process name**
* The **current status** (Running, Paused, or Inactive)
* The **current page number** (for example, *Page 01 of 05*)

Because the boot manager is a regular user process, it must obey the same rules as every other program: it requests access to the LCD through the mutex system, uses system calls to manage processes, and cooperates with the scheduler. This made it a good demonstration that the OS abstractions I built were not just theoretical, but actually usable to construct higher-level system software on top of the kernel.

## Demo User Processes

To demonstrate that StumpOS could support real user programs, I implemented several example processes:

* A timer program
* An LED animation which showed a precomputed sine wave
* A non-blocking music player (yes, *Never Gonna Give You Up*)
* A reset program (rebooted the system)
* A mini crash program (invoked sys\_panic)

The most time-consuming one (pun intended) was the timer program.

I designed the timer specifically to showcase several OS features working together. When opened, the timer runs as a foreground process, allowing the user to configure the countdown using the LCD and buttons. The user can click exit and go back to the boot menu and restore the foreground once requested. If the user starts the timer, it will allow the background tick to start, which will read the RTC clock and decrement the timer if the seconds value is different. When it reaches zero, it dynamically spawns an $\text{ALARM ACTIVE}$ process, which forcefully claims the foreground and relevant peripherals, taking over the display and input until the user explicitly dismisses it using the keypad.

## Some Ideas That I Scrapped

Over the course of the project, I came up with far more ideas than I realistically had time to implement.

One idea was a **more advanced music system**. The plan was to introduce a note queue where user programs could enqueue notes, and a dedicated **music daemon** would manage playback. A *daemon* is a background process that runs continuously without direct user interaction, typically responsible for managing a specific service. On each tick, the daemon would check whether the buzzer was currently in use; if it was busy, the daemon would just yield, otherwise the next note in the queue would be played. While this would have resulted in cleaner, non-blocking music playback, it quickly became clear that this level of abstraction was **overkill for the scope of the coursework**.

Another idea was an **input daemon**. Instead of each process polling hardware directly, a background process would periodically read the keypad, switches, and buttons, convert these into structured events, and push them into an **event queue**. User processes would then consume events rather than touching hardware registers directly. Although this is much closer to how real operating systems handle input, I ran into practical issues around **timing, buffering, and memory usage**, which made the idea infeasible without significantly complicating the rest of the system.

One feature I would still like to add in the future is **stack canaries**. A stack canary is a small, known value placed at the start and end of the stack and is a very simple mechanism used to detect memory corruption. Before returning from a function, the kernel checks that the canary value is still intact; if it has been overwritten, a stack overflow is detected. Since all processes share the same heap and memory space, a stack overflow in one process can silently corrupt memory belonging to another. Stack canaries would provide a lightweight way to detect this kind of corruption early and fail more safely, rather than letting bugs propagate unpredictably through the system.

## Conclusion

This project taught me a lot about operating system concepts. I learned the value of modular planning, even when writing assembly, and how much simpler development becomes when you invest in tools like macros and structured compilation. I also gained a deeper appreciation for cooperative scheduling, context switching, and resource arbitration, seeing firsthand how complex even a small OS can become. Even though a lot of the time was spent banging my head against the wall and swearing at the assembler, seeing everything finally work was incredibly rewarding. After completing this project, I feel much more prepared for the day I might create my own operating system for a real computer, not just an embedded board.
