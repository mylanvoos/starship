# Starship 🛰️
## A Signal-based JSX Compiler Framework

![](https://raw.githubusercontent.com/mylanvoos/starship/refs/heads/main/public/starship.png)

Starship is an **experimental** compiler framework designed to explore modern frontend framework architectures and patterns. Unlike traditional frameworks that compile to vanilla JavaScript, Starship transforms its custom .uss files into JSX, leveraging React's runtime while providing its own reactive paradigms and ergonomic syntax.

Contributions and discussions are welcome!

## Core Features
### 📡 Signal-based Reactivity

Starship implements a sophisticated reactivity system using Signals, protected by SignalGuards and managed through a global SignalStore

```typescript
// Individual signal creation
const [counter, setCounter, attach] = createSignal(0)

// Batch signal creation with automatic setter/attacher generation
const { counter, message, voyagerThreshold } = createSignals({
  _counter: 0,  // '_' prefix to skip attacher generation
  message: "",
  voyagerThreshold: 5
})
```
### Pattern Matching

Inspired by Rust, Starship introduces functional pattern matching for elegant state management:

```typescript
attachToCounter(() => setMessage(counter, [
  [ when(v => v > 10), effect("Value too high!") ],
  [ when(v => v === 0), effect("Starting point") ],
  [ _, effect("Default case") ]
]))
```
### Ergonomic Template Syntax
Starship organises components using a familiar three-section, single-file component structure similar to Vue (although you do not need to declare the `<template>` section!)

```jsx
{/* The minimal Starship app */}
<div ".container">
  <button on:click={setCounter(-1)}> -1 </button>
    { counter }
  <button on:click={setCounter(+1)}> +1 </button>
</div>

<script>
const { counter } = createSignals({ counter: 0 })
</script>

<style>
.container { /* ... */ }
</style>
```

It also provides built-in shorthand syntax for common operations:

- **Class Shorthand**: `<div ".className">` → `<div className="className">`
- **Id Shorthand**: `<p "#id">` → `<p id="id">`
- **Link Shorthand**: `<a {../path}>` → `<a href="../path">`
- **Image Shorthand**: `<img {../path} "alt" [50,50] />` → `<img src="../path" alt="alt" width="50" height="50" />
- **Input Shorthand**: `<input {email} @"Placeholder text">` → `<input type="email" placeholder="Placeholder text">`

### Declarative Control Flow

```jsx
{/* Conditional Rendering */}
<Show when={counter === threshold}>
  <p>Threshold reached!</p>
</Show>

{/* Array Iteration */}
<For {items}:in:{array}>
  {item.name}
</For>

{/* Range-based Iteration */}
<For {index}:range:{array}>
  Item #{index}
</For>
```

### Technical Architecture

Starship operates as a multi-stage compiler framework:

1. Template Compilation Layer
- **Tokenise**: `.uss` files are processed into template tokens
- **Parse**: Template tokens are parsed into an AST
- **Transform**: Elements, along with attribute shortcuts and control flow components, are converted to JSX

2. Reactivity Layer
- **Create**: Signals are created through `createSignal(s)` methods
- **Guard**: SignalGuards are returned as getters, preventing state mutations
- **Generate**: Automatic setter (`setVar`) and attacher (`attachToVar`) methods are generated

3. Runtime Layer
- **JSX**: JSX transformation (via React's `h` and `Fragment`)
- **Integrate**: Integration with Vite's build pipeline
- **Render**: Rendering of components, DOM manipulation, and event handling


### Development Status
Starship is currently under development. It's not recommended for production use. Current focus areas are:

  - CLI tool
  - Minimal template
  - Browser-based editor
  - Testing suite
  - Documentation

### License
MIT