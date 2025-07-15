---
title: "Testing The Maths rendering"
date: "2025-06-08"
description: "Testing Maths."
---
In operational semantics we are concerned with what a program is doing.

At the heart of it what a program does is change the values of variables.

# Sate

The state within the [[While Programming Language]] is the values of all of the variables within a program.

This is a [[Functions|function]] often denoted by the greek letter $\sigma$  from the [[Sets|set]] of Variables to the real number such that $\{ x \in Vars | \sigma x \neq 0 \}$

Which means that a state will represent all non zero variables since if we would not specify  this constraint the set of variables would be infinitely large

## Assignment Rule

The standard convention for writing states is a set where:
$$
\{ var_{1} \mapsto \mathbb{R}, var_{2} \mapsto \mathbb{R}, \dots, var_{n} \mapsto \mathbb{R} \}
$$
where anything that we do not specify is 0.

Since it is a function we can use them

## Variable retrieval

To retrieve a state from our state function we can use the notation
$$
(\{ var_{1} \mapsto \mathbb{R} \})var_{1} = \mathbb{R}
$$

## State Updating

The notion to perform a state update is:
$$
(\sigma[x \mapsto n])y = \begin{cases}
 n & y=x\\
\sigma y & else_{1}
\end{cases}
$$

This can be extended so that multiple updates can be written at once:
$$
\sigma[x \mapsto n, n \mapsto 2]
$$
For this example we are performing these updates concurrently (one after the other) so we are able to mention the same state multiple times

# Program Pair

To find what a program will do we need two things:

- The program instructions
- The current state of the program
To represent this the following notation is used

$$
< S, \sigma> \implies <S' , \sigma'>
$$

where S is the original instruction, S' is the instruction after one step, $\sigma$ is the original state of the program and $\sigma'$ is the state after a single step (after all state updates ) the $\implies$ shows the [[Relations|relation]] between the two pairs

## Steps

$$
<x := a, \sigma > \implies <skip, \sigma[x \mapsto A a \sigma]
$$
where A is a function that returns a numeric value which is the result of the computation of the arithmetic expression which $a$ represents. This is needed since $a$ could be something like $<x := x+y>$ where $a = x+y$

$skip$ is a program which does nothing.
$$
<skip; S, \sigma > \implies <S, \sigma>
$$

this leads to the definition
$$
< S; S'', \sigma > \implies <S';S'', \sigma'>
$$
which gives the while language its sequential definition where a statement separated by a semicolon `;` will step through the earlier statement first

# Example Program

take the following program:

```while
z := x
x := y
y := z
```

where the state $\sigma$ is $\{ x \mapsto 1, y \mapsto 2\}$
written in pair notation:
$$
\begin{array}{left}

& <z:=x; x:=y;y:=z , \{ x \mapsto 1, y \mapsto 2\}> \\
\implies &<skip; x:=y;y:=z , \{ x \mapsto 1, y \mapsto 2 \} [z \mapsto 1]> \\
\implies &<skip; x:=y;y:=z , \{ x \mapsto 1, y \mapsto 2,  z \mapsto 1\} > \\
\implies &<x:=y;y:=z , \{ x \mapsto 1, y \mapsto 2,  z \mapsto 1\} > \\
\implies &<skip;y:=z , \{ x \mapsto 1, y \mapsto 2,  z \mapsto 1\}[x \mapsto 2]> \\
\implies &<skip;y:=z , \{ x \mapsto 2, y \mapsto 2,  z \mapsto 1\} > \\
\implies &<y:=z , \{ x \mapsto 2, y \mapsto 2,  z \mapsto 1\} > \\
\implies &<skip , \{ x \mapsto 2, y \mapsto 2,  z \mapsto 1\}[y \mapsto 1] > \\
\implies &<skip , \{ x \mapsto 2, y \mapsto 1,  z \mapsto 1\} > \\

\end{array}

$$

> [!Note]
> The notation $\implies^{n}$ is shorthand for describing the result after performing n computation steps.

# If Statement

$$
<\text{if } b \text{ then } S \text{ else } S', \sigma  > \implies \begin{cases}
<S, \sigma> & \beta b \sigma = tt \\
<S', \sigma'> & else
\end{cases}
$$

# While Rule

$$
<\text{while } b \text{ do } S , \sigma  > \implies \begin{cases}
<S;\text{while } b \text{ do } S, \sigma> & \beta b \sigma = tt \\
<skip, \sigma> & else
\end{cases}
$$
