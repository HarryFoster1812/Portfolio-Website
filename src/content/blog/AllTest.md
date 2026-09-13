---
title: "MarkdownRenderer Feature Test"
date: "2025-07-15"
description: "A comprehensive test of the MarkdownRenderer capabilities, including images, videos, math, code, diagrams, and more."
tags:
  - Markdown
  - Renderer
  - Testing
  - KaTeX
  - Mermaid
  - Code
featured: false
---

## MarkdownRenderer Feature Test

This blog post is designed to test the full feature set of your MarkdownRenderer with styling aligned to **harryfoster.tech** — dark background, blue highlights, and clean typography.

---

## 🖼️ Image Test

![Sample Unsplash Image](https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1350&q=80)

> This is a responsive test image from Unsplash.

---

## 🎥 Video Test

<video controls autoplay muted loop style="max-width: 100%; border-radius: 12px;">
  <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

---

## 🧮 Math Test (KaTeX)

Inline math example: $E = mc^2$

Display math example:

$$
\int_0^\infty e^{-x^2} \, dx = \frac{\sqrt{\pi}}{2}
$$

---

## 💻 Code Block Test

```javascript
// Syntax highlighting test using atom-one-dark
const greet = (name) => {
  console.log(`Hello, ${name}!`);
};
greet("Harry");
```

---

## 🔤 Standard Markdown Elements

### Headings

#### This is a Level 4 heading

##### This is a Level 5 heading

---

### Lists

- Unordered item 1
- Unordered item 2
  - Nested item

1. Ordered item 1
2. Ordered item 2

---

### Blockquote

> "Design is not just what it looks like and feels like. Design is how it works."  
> — _Steve Jobs_

---

### Link

[Visit harryfoster.tech](https://harryfoster.tech)

---

### Blockquote

> "Design is not just what it looks like and feels like. Design is how it works."  
> — _Steve Jobs_

> ### Nested Blockquote
>
> > This is a quote inside a quote.

---

### Emphasis

**Bold text**  
_Italic text_  
~~Strikethrough~~  
_**Bold and italic**_

---

### Tables

| Feature          | Supported | Notes                       |
| ---------------- | --------- | --------------------------- |
| Images           | ✅        | Responsive on all screens   |
| Videos           | ✅        | Autoplay and loop tested    |
| KaTeX Math       | ✅        | Both inline and block modes |
| Mermaid          | ✅        | Flowcharts supported        |
| Syntax Highlight | ✅        | Theme: `atom-one-dark`      |

---

### Inline Code and Code Span

Use inline code like `console.log("hello")` for short snippets.

---

### HTML in Markdown

<div style="padding: 1rem; background: #333; border-radius: 8px;">
  <strong style="color: #00ABE4;">This is a custom HTML block</strong> inside markdown.
</div>

---

### Images with Alt Text and Dimensions

![Alt text](https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80 "Sample Image")

---

### Link with Title Attribute

[OpenAI's website](https://openai.com "Visit OpenAI")

---

### Escaped Characters

Use `\*` to render a literal asterisk: \*

---

### Footnotes[^1]

[^1]: This is a footnote used to test footnote rendering.

---

### Task List

- [x] Render basic elements
- [x] Render diagrams and math
- [ ] Add collapsible sections (optional)
- [x] Include code and styling tests

---

## ✅ Extended Summary

This extended section confirms rendering of:

- ✅ Nested lists and blockquotes
- ✅ Inline code and escaped characters
- ✅ Task lists and emojis
- ✅ Footnotes and tables
- ✅ Custom inline HTML

---

## 🧩 Collapsible Details Test

<details>
  <summary style="cursor: pointer;">Click to Expand: What is Markdown?</summary>
  <p>Markdown is a lightweight markup language used to format plain text. It’s widely used for writing documentation, blog posts, and README files.</p>
</details>

<details>
  <summary style="cursor: pointer;">Click to Expand: What is Mermaid?</summary>
  <p>Mermaid allows you to generate diagrams and flowcharts using text and code. It’s especially useful in technical documentation.</p>
</details>

---

## 🚨 Callout Component Test (Improved Styling)

<div style="border-left: 4px solid #00ABE4; padding: 1rem; background-color: #1f1f1f; border-radius: 8px;">
  <strong>ℹ️ Info:</strong> This is an informational callout used to convey neutral messages or extra context.
</div>

<div style="border-left: 4px solid #FFD700; padding: 1rem; background-color: #2a2a00; border-radius: 8px; margin-top: 1rem;">
  <strong>⚠️ Warning:</strong> Be cautious when using experimental or unstable features.
</div>

<div style="border-left: 4px solid #00C851; padding: 1rem; background-color: #003322; border-radius: 8px; margin-top: 1rem;">
  <strong>✅ Success:</strong> All renderer components passed their rendering tests successfully.
</div>

<div style="border-left: 4px solid #ff4444; padding: 1rem; background-color: #330000; border-radius: 8px; margin-top: 1rem;">
  <strong>❌ Error:</strong> Something didn’t work correctly. Check the console or devtools for more details.
</div>

<div style="border-left: 4px solid #33b5e5; padding: 1rem; background-color: #002633; border-radius: 8px; margin-top: 1rem;">
  <strong>💡 Tip:</strong> You can abstract these into reusable React components like.
</div>
