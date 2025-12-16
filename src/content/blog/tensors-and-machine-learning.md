---
title: "Tensors and Machine Learning"
date: "2025-07-20"
description: "An overview of what tensors are and how they relate to machine learning"
tags:
  - Tensors
  - Machine Learning
  - PyTorch
  - TensorFlow
project:
  name: "FosterML"
  slug: "FosterML"
featured: false
---

## What are tensors

A tensor is essentially a **container for numbers**. Think of it as a generalized array that can store data in multiple dimensions:

- A **scalar** (single number) is a 0-dimensional tensor.
- A **vector** (list of numbers) is a 1-dimensional tensor.
- A **matrix** (table of numbers) is a 2-dimensional tensor.
- Higher-dimensional arrays are called **higher-order tensors**.

Tensors are the fundamental data structure in most machine learning frameworks, like PyTorch and TensorFlow.

## How are they different in physics

In physics, a tensor has a **more strict mathematical meaning**: it's an object that transforms according to certain rules under a change of coordinates. For example, the stress tensor or the moment of inertia tensor changes predictably when you rotate your coordinate system.

To be very honest, I stared learning about tensors from a physics point of view and I stop once I realised that it doesn't align with how they are used in computer science.

In machine learning, we **ignore these transformation rules**. Here, tensors are just multi-dimensional arrays with additional computational properties like gradients.

## Practical uses

Tensors are everywhere in machine learning:

- Represent **input data**: images are 3D tensors (height $\cdot$  width $\cdot$ channels).  
- Represent **weights and biases** in neural networks.  
- Enable **batch computations** for efficient training.  
- Support **automatic differentiation**: gradients are computed with respect to tensor operations.

## Unique Features

Tensors are more than just arrays. One of their unique features are:

### Broadcasting

Broadcasting allows tensors of different shapes to participate in **element-wise operations**, as long as their shapes are compatible. Here are the main rules:

1. **Align shapes from the right**  
   Compare the shapes of the tensors starting from the last (rightmost) dimension.  

2. **Dimensions must be equal or 1**  
   For each dimension:  
   - If the sizes are equal, they match.  
   - If one size is 1, it can be broadcast to match the other size.  
   - If neither condition holds, broadcasting **fails**.

3. **Tensors can be broadcast to higher dimensions**  
   If one tensor has fewer dimensions, it is **implicitly padded with 1s on the left**. For example:  

   ```python
   a = torch.tensor([[1, 2, 3],
                     [4, 5, 6]])   # shape (2,3)
   b = torch.tensor([10, 20, 30])   # shape (3,)
   c = a + b
   ```

Conceptually, b is treated as having shape (1,3) so it can be broadcast to (2,3).

4. Shape 1 can always expand
    Any dimension of size 1 can be stretched to match the corresponding dimension of the other tensor.

Broadcasting is something that can be a little confusing since we are essentially creating/duplicating numbers out of thin air.

Take this example:

```python
x = torch.tensor([[1],
                  [2],
                  [3]])   # shape (3,1)
y = torch.tensor([10, 20, 30]) # shape (3,)
z = x + y
```

Remember that shape of a tensor is read from left to right with increasing dimensions.
Here x has 3 rows and 1 column
Here y has 1 row and 3 columns

So when we apply the rules of broadcasing the resulting shape is going to be (3,3).
When we broadcast x we are extending it to 3 columns and we end up with x being:
[1,1,1]
[2,2,2]
[3,3,3]

And for y we broadcast it to have 3 rows so we end up with:
[10,20,30]
[10,20,30]
[10,20,30]

And then we proceed to perform the addition element-wise:
[10+1, 20+1, 30+1]
[10+2, 20+2, 30+2]
[10+3, 20+3, 30+3]

Leading to the final result of:
[11, 21, 31]
[12, 22, 32]
[13, 23, 33]

## View Tensors

Duplicating these tensors are very space and time inefficient since we already have the core data and duplicating it would be a waste of processing power and memory space. This is why in real libraries we don't duplicate the memory.

For small examples, broadcasting doesn't really matter when talking about memory; duplicating a few numbers is trivial.

However, imagine a very large dataset, such as a batch of videos. Suppose we have:

- 10 videos  
- Each video is 1 minute long at 60 frames per second → 3600 frames  
- RGB channels  
- Resolution 1920×1080  

The input tensor shape would be:
(10, 3600, 3, 1080, 1920)

Now suppose we want to multiply this tensor by a scalar value `2`, which has shape `(1)`.  

By the rules of broadcasting, the scalar would conceptually be **duplicated to match the shape of the tensor**, which is:
10 × 3600 × 3 × 1080 × 1920 = 223,948,800,000 elements
I think putting this number into words makes it much more impactful:
Two hundred twenty-three billion, nine hundred forty-eight million, eight hundred thousand

Assuming `2` is stored as a 4-byte integer, the memory required would be:
223,948,800,000 × 4 bytes = 895.8 GB

Clearly, physically duplicating the scalar would be **completely impractical**. This is why modern frameworks handle broadcasting **without actually copying data**, treating the scalar as if it fills the tensor for operations while only storing it once.

This is what we call a view tensor since it creates a surface level tensor that looks like it is the desired shape but actually utilised the same memory.
