## Starship - An experimental JSX-based frontend framework ###

![](https://raw.githubusercontent.com/mylanvoos/starship/refs/heads/main/public/starship.png)

```jsx
<div ".container">
  <h1 "#text">Starship 🛰️</h1>
  <p "#text">The classic button experiment to test reactivity...</p>
  <button on:click={setCounter(-1)}> -1 </button>
      { counter }
  <button on:click={setCounter(+1)}> +1 </button>
  <button on:click={setVoyagerThreshold(counter)}> Set Voyager activation code </button>
  <p "#text">{ message }</p>
</div>
<div ".container2">
  <img {https://science.nasa.gov/wp-content/uploads/2024/03/voyager-record-diagram.jpeg} "NASA Voyager" [450,250] />
  <a {../link}>This is a link</a>
</div>
```
```typescript
<script>
const { counter, message, voyagerThreshold } = createSignals({
  _counter: 0,
  message: "",
  voyagerThreshold: 5
})

attachToCounter(() => setMessage(counter,
  [ when(v => v > 10 || v < -10), effect(() => {
    setCounter(0)
    return "Cannot exceed +=10!"
  }) ],
  [ when(v => v === 0), effect("Press a button to get started.")],
  [ when(v => [1, 2, 3, 4].includes(v)), effect(`${counter} is between [1, 4] (you can do range-based pattern matching!)`)],
  [ _, effect(`Keep pressing...`) ]
))
</script>
```
```css
<style>
body {
  font-family: "Lucida Console";
}
button {
  margin: 0 20px;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
}
</style>
```

This is an experiment in creating a custom frontend framework in an attempt to better understand how modern frameworks like React, Vue, Svelte, and Angular work under the hood. Thus, Starship was born.

Starship is an experimental framework that implements its own reactive state management, templating syntax, compiler, and JSX-based DOM manipulation. Unlike other frameworks, it does not compile to plain JavaScript but rather converts Starship.uss files into JSX, allowing React to handle the final transformation into JavaScript. Starship places heavy emphasis on *variable naming* and prioritises *conciseness* along with *development speed*. 

### Reactivity

#### How It Works:

- Reactivity in Starship is controlled by `Signals` and their attached listener functions, allowing you to set up reactions to signal changes.
- Starship uses a global `SignalStore`, tracking application state for each signal.
- Each signal has an associated `Sentry` for managing listeners, functions that run whenever the signal's value changes.
- `SignalGuard` protects signal values, allowing changes only through the generated setter function.

You can create signals using either the `createSignal` or the `createSignals` methods.

#### Using the `createSignal` method

In Starship, `createSignal` creates a reactive signal with a `getter`, `setter`, and `attacher`. This setup allows for a streamlined reactivity system inspired by React's `useState` hook (in fact, this started as an attempt to 'clone' React!)

```typescript
const [counter, setCounter, attach] = createSignal(0)
```

You can explicitly specify the names for the `setter` and the `attacher` methods using `createSignal`.

#### Using the `createSignals` method

The `createSignals` method allows you to set up multiple individual signals at the same time. When you call this method, Starship automatically generates both a `setter` (e.g., `setCounter`) and an `attacher` (e.g., `attachToCounter`) for each of your variables. They both obey a strict naming convention.

- By default, a `var` variable created through `createSignals` will have `setVar` and `attachToVar` generated.
- If you want to avoid creating unnecessary attachers, simply add a `_` symbol before the variable name.

```typescript
const { counter, message, voyagerThreshold } = createSignals({
  _counter: 0,
  message: "",
  voyagerThreshold: 5
})
```

### Using Pattern Matching for Functional Control

Inspired by Rust, Starship enables pattern matching for control flows. This is powerful for handling different cases based on the signal value.

```typescript
attachToCounter(() => setMessage(counter.value, [
  [ when(v => v >= 10 || v <= -10), effect(() => {
    setCounter(0)
    return "Cannot exceed +=10!"
  }) ],
  [ when(v => v === 0), effect("Press a button to get started.")],
  [ when(v => [1, 2, 3, 4].includes(v)), effect(`${counter.value} is between [1, 4] (you can do range-based pattern matching!)`)],
  [ _, effect(`Keep pressing...`) ]
]))
```

### Conditional rendering with `<Show when={...}>`
The <Show> component in Starship lets you render elements based on conditions in a simple, readable way. It renders the content inside <Show> only when the when condition is met

```jsx
<Show when={voyagerThreshold === counter}>
  <img {https://science.nasa.gov/wp-content/uploads/2024/03/voyager-record-diagram.jpeg} />
</Show>
```

"Show the Voyager record image when the `voyager` evaluates to true!"