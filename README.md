## Starship - A novel frontend framework inspired by React and Vue ###

![](https://raw.githubusercontent.com/mylanvoos/starship/refs/heads/main/public/starship.png)

<details>
  <summary>Show Code</summary>

```jsx
<template>
  <div class="container">
      <h1 class="title">Starship 🛰️</h1>
      <p>The classic button experiment to test reactivity...</p>
      <button onClick={() => setCounter(counter.value - 1)}> -1 </button>
        { counter }
      <button onClick={() => setCounter(counter.value + 1)}> +1 </button>
      <button onClick={() => setVoyagerThreshold(counter.value)}> Set Voyager activation code </button>
      <p>{ message }</p>
      <p>Voyager online at: { voyagerThreshold }</p>
      <Show when={() => voyagerThreshold.value === counter.value}>
        <img src='https://science.nasa.gov/wp-content/uploads/2024/03/voyager-record-diagram.jpeg' />
      </Show>
  </div>
</template>

```
```typescript
<script>
const [counter, setCounter, attachToCounter] = createSignal<number>(0)
const [message, setMessage] = createSignal<string>("")
const [voyagerThreshold, setVoyagerThreshold, attachToThreshold] = createSignal<number>(5)

attachToCounter(() => setMessage(counter.value, [
  [ when(v => v > 10 || v < -10), effect(() => {
    setCounter(0)
    return "Cannot exceed +=10!"
  }) ],
  [ when(v => v === 0), effect("Press a button to get started.")],
  [ when(v => [1, 2, 3, 4].includes(v)), effect(`${counter.value} is between [1, 4] (you can do range-based pattern matching!)`)],
  [ _, effect(`Keep pressing...`) ]
]))
  </script>
```
```css
<style>
body {
  font-family: "Lucida Console";
  width: 500px;
  margin: auto;
}
button {
  margin: 0 20px;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
}
</style>
```
</details> 

This is an experiment in making a frontend framework that is *reactive*, can *manage the application state* and *manipulate the DOM*, and has a *component-based architecture*. 

### Reactivity: an attempt at recreating React's `useState` hook from scratch

```typescript 
const [counter, setCounter, attach] = createSignal<number>(0)
```
 
The way React implements the useState hook is by having a state array and a pointer to know which useState we are currently on. After the useState function is fired, it increments this pointer so that the next useState function will work with its state, and so on. 

We use a similar approach here, using a global signal store to keep track of the application state. The addition of the attacher function allows you to register listener functions to a signal/state that will be automatically triggered whenever the signal/state changes value.

### A little functional(ity)...

Inspired by Rust, Starship lets you do pattern matching in its signal setters or using the `match()` function.

```typescript
const [counter, setCounter, attachToCounter] = createSignal<number>(0)
const [message, setMessage, attachToMessage] = createSignal<string>('')

attachToCounter(() => setMessage(counter.value, [
  [ when(v => v >= 10 || v <= -10), effect("Cannot exceed +=10!") ],
  [ when(v => v === 0), effect("Press a button to get started.")],
  [ when(v => [1, 2, 3, 4].includes(v)), effect(`${counter.value} is between [1, 4] (you can do range-based pattern matching!)`)],
  [ _, effect(`Keep pressing...`) ]
]))
```

### Vue-like syntax 
`<template>`, `<script>`, and `<style>` here! A custom Vite plugin was needed to make this work. By default, `<template>` uses JSX and `<script>` uses TypeScript.

### Conditional rendering with `<Show when={...}>`
Whatever's inside the `<Show>` block gets rendered when the expression inside `when` evaluates to true. 

```jsx
<Show when={() => voyagerThreshold.value === counter.value}>
  <img src='https://science.nasa.gov/wp-content/uploads/2024/03/voyager-record-diagram.jpeg' />
</Show>
```

"Show the Voyager record image when the `voyager` evaluates to true!"