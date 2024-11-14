# Starship 🛰️
## A Signal-based JSX Compiler Framework

![](https://raw.githubusercontent.com/mylanvoos/starship/refs/heads/main/public/starship.png)

Starship is an **experimental** compiler framework designed to explore modern frontend framework architectures and patterns. Unlike traditional frameworks that compile to vanilla JavaScript, Starship transforms its custom `.uss` files into JSX, leveraging React's runtime while providing its own reactive paradigms and ergonomic syntax.

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

Inspired by Rust, Starship introduces functional pattern matching for elegant state management using the `match` function. 

```typescript
// Signal setters support pattern matching out of the box
attachToCounter(() => setMessage(counter, [
  [when(v => v > 10), "Value too high!"],
  [when(v => v === 0), "Starting point"],
  [when(v => range(2, 6).includes(v)), "Just alright"],
  [_, "Default case"]
]))

// Match objects and use RegEx!
const objResult = match({ x: 1, y: "hello" }, [
    [{ x: when(n => n > 0), y: /^h/ }, "Matched!"],
    [_, "No match"]
])

const person = { name: "Alice", age: 30 };
const greeting = match(person, [
    [{ name: "Alice" }, "Hello, Alice!"],
    [{ age: when(n => n >= 18) }, "Hello, Adult!"],
    [_, "Hello, Stranger!"]
]);

```

The `range` function allows quick creation of arrays for various data types.

```typescript
const numberRange = range(1, 5)
// Output: [1, 2, 3, 4, 5]

const charRange = range('a', 'e');
// Output: ['a', 'b', 'c', 'd', 'e']

const startDate = new Date(2023, 0, 1);
const endDate = new Date(2023, 0, 5);
const dates = range(startDate, endDate);
// Output:
// Sun Jan 01 2023
// Mon Jan 02 2023
// Tue Jan 03 2023
// Wed Jan 04 2023
// Thu Jan 05 2023
```

`range` is intelligent about ordering and supports custom steps:

```typescript
const reverseNumberRange = range(5, 1)
// Output: [5, 4, 3, 2, 1]

const customRange = range(1, 10, (n) => n + 3)
// Output: [1, 4, 7, 10]

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
- **Image Shorthand**: `<img {../path} "alt" [50,50] />` → `<img src="../path" alt="alt" width="50" height="50" />`
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