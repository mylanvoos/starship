# Starship 🛰️

```
// USS Enterprise NCC-1701B (https://ascii.co.uk/art/startrek)
                                                         _.--------._
 __.------------------------------------.            _.-'            `-._
|___   (===========================) ----)    .----.'     __.----.__     `.
    `-----------------------------------'    /    /    ,-'          `-.    `.
                          |   |_____________,====/____/___________     \     \
                ____.-----|   |             |  |     \ |_|_|_|_| /`.    \     |
            ,--'    ,-' .-+---+----._       |__| ,-.  \\________`-.-`.   |    |
           <==(    (|  <            _>-------__| >-<    ____(__)) |--|   |    |
            `--.____`-. `-+---+----'        |  | `-'  //________.-'-,'   |    |
                    `-----|   |_____________|  |_____/_|_|_|_|_|_\,'    /     |
                          |   |             `====\    \                /     /
 ___.-----------------------------------.    \    \    `-.__      __.-'    .'
|__    (===========================) ----)    `----`._      `----'      _.'
   `------------------------------------'             `-._          _.-'   
                                                          `--------'
```
## A Signal-based JSX Compiler Framework

Starship is a **highly experimental** compiler framework designed to explore modern frontend framework architectures and patterns. Unlike traditional frameworks that compile to vanilla JavaScript, Starship transforms its custom `.uss` files into JSX, leveraging React's runtime while providing its own reactive paradigms and ergonomic syntax.

## Full Example

![](https://raw.githubusercontent.com/myanvoos/starship/refs/heads/docs/public/starship.gif)
<details>
  <summary>Show code 🔎</summary>
  
```typescript
<script>
// Initialise reactive signals
const { count, message, blocked, nuked } = createSignals({
  _count: 0,
  message: { title: "Hello Starship!", subtitle: "Try pressing a button below!" },
  blocked: false,
  nuked: false
})

const timeout = () => {
    setBlocked(true)
    setTimeout(() => {
      setBlocked(false)
    }, 3000)
}

// Main pattern matching logic for displaying texts based on the value of count
attachToCount(() => setMessage(count.value, 
  [
    [ when(v => range(5, 10).includes(v)), { title: "Hello Starship!", subtitle: "Getting a bit high, isn't it?" } ],
    [ when(v => range(10, 20).includes(v)), { title: "I mean, up to you...", subtitle: "Should probably decrease at some point..." } ],
    [ when(v => range(20, 26).includes(v)), { title: "I mean, up to you...", subtitle: "Decrease now?" } ],
    [ when(v => v === 27), effect(() => {
      timeout()
      return { title: "Decrease the value.", subtitle: "Do it. Press the button." }
    }) ],
    [ when(v => v === 28), effect(() => {
      timeout()
      return { title: "No.", subtitle: "Stop. There's a perfectly clickable button down below. What are you waiting for?" }
    }) ],
    [ when(v => v === 29), effect(() => {
      timeout()
      return { title: "NO.", subtitle: "Stop. It." }
    }) ],
    [ _, { title: "Hello Starship!", subtitle: "Keep going..." } ]
  ]
))

// Same as above, but with toggling a boolean
attachToCount(() => setNuked(count.value, [
  [ when(v => v === 30), true],
  [ _, false ]
]))
</script>

{/* Conditional template rendering */}
<Show when={!nuked}>
  <div ".container max-w-[800px] m-auto p-2 text-center space-y-5">
    <h1>{message.value.title}</h1>
    <h2 ".text-lg mb-10">{message.value.subtitle}</h2>
    <p>Count: {count}</p>
    <div ".flex flex-col w-[180px] m-auto space-y-5">
      <Show when={!blocked}>
        <button on:click={setCount(++1)}>Increment</button>
      </Show>
      <button on:click={setCount(--1)}>Decrement</button>
    </div>
  </div>
</Show>
<Show when={nuked}>
  <img {https://t.ly/TN8UI} />
</Show>

  ```

</details>


## Core Features
### 📡 Signal-based Reactivity

Starship implements a sophisticated reactivity system using Signals, protected by SignalGuards and managed through a global SignalStore.

```typescript
// Individual signal creation
const [counter, setCounter, attachToCounter] = createSignal(0)

// Batch signal creation with automatic setter generation
const { counter, message, person } = createSignals({
  _counter: 0,  // '_' prefix to opt-in to automatic attacher generation
  message: "",
  person: {
    name: "John Doe",
    age: 19
  }
})
```
### Pattern Matching

Inspired by Rust, Starship introduces functional pattern matching for elegant state management using the `match` function. 

```typescript
// Signal setters support pattern matching out of the box without the need to call `match`
attachToCounter(() => setMessage(counter.value, [
  [ when(v => v > 10), "Value too high!"],
  [ when(v => v === 0), "Starting point"],
  [ when(v => range(2, 6).includes(v)), "Just alright"],
  [_, "Default case"]
]))

// Match objects and use RegEx
const objResult = match({ x: 1, y: "hello" }, [
    [{ x: when(n => n > 0), y: /^h/ }, "Matched!"],
    [_, "No match"]
])

const person = { name: "Alice", age: 30 };
const greeting = match(person, [
    [{ name: "Alice" }, "Hello, Alice!"],
    [{ age: when(n => n >= 18) }, "Hello, adult person!"],
    [_, "Hello, stranger!"]
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
// Output: [4, 7, 10]

```
### Ergonomic Template Syntax
Starship organises components using a familiar three-section, single-file component structure similar to Vue (although you do not need to declare the `<template>` section!)

The compiler treats everything not inside the `<script>` or `<style>` sections as templating code.

```jsx
{/* The minimal Starship app */}
<div ".container">
  <button on:click={setCounter(--1)}> -1 </button>
    { counter }
  <button on:click={setCounter(++1)}> +1 </button>
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

As well as setter shortcuts for number-valued, string-valued, and boolean-valued signals.

```typescript
setCount(++1)     // expands to: setCount(count => count.value + 1)
setCount(--x)     // expands to: setCount(count => count.value - x)

setMsg(+"hello world")    // expands to: setMsg(msg => msg.value + "hello world")
setMsg(-"Foo")            // expands to: setMsg(msg => msg.value.replace("Foo", ""))

setBool(!)     // expands to: setBool(bool => !bool.value)
```

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
Starship is an experimental project made to delve a bit deeper into modern frontend frameworks and how they work. I might revisit it one day to work on the following features:

  - Better support for arrays and deep-nested objects
  - Better syntax design
  - Better JSX transformations
  - Handling both `.uss` and `.jsx/.tsx` files in one project
  - Proper error messages
  - Passing props between components

### License
MIT
