## Starship.js - Yet another JavaScript framework ###

```
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
      <Show when={voyager}>
        <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/The_Sounds_of_Earth_Record_Cover_-_GPN-2000-001978.jpg/800px-The_Sounds_of_Earth_Record_Cover_-_GPN-2000-001978.jpg' />
      </Show>
  </div>
</template>

<script>
const [counter, setCounter, attachToCounter] = createSignal<number>(0)
const [message, setMessage] = createSignal<string>("")
const [voyagerThreshold, setVoyagerThreshold, attachToThreshold] = createSignal<number>(5)
const [voyager, setVoyagerDisplay] = createSignal<boolean>(false)

attachToCounter(() => setMessage(counter.value, [
  [ when(v => v > 10 || v < -10), effect(() => {
    setCounter(0)
    return "Cannot exceed +=10!"
  }) ],
  [ when(v => v === 0), effect("Press a button to get started.")],
  [ when(v => [1, 2, 3, 4].includes(v)), effect(`${counter.value} is between [1, 4] (you can do range-based pattern matching!)`)],
  [ _, effect(`Keep pressing...`) ]
]))

// Two-way link 
attachToCounter(() => {
  if (voyagerThreshold.value === counter.value) setVoyagerDisplay(true)
  else setVoyagerDisplay(false)
})
attachToThreshold(() => { 
  if (voyagerThreshold.value === counter.value) setVoyagerDisplay(true)
  else setVoyagerDisplay(false)
})
</script>

<style>
body {
  font-family: "Lucida Console";
  font-size: 16px;
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

This is an experiment in making a frontend framework that is *reactive*, can *manage the application state* and *manipulate the DOM*, and has a *component-based architecture*. 

Inspired by React, Vue, and Solid.js

### Reactivity: an attempt at recreating React's useState hook from scratch

`const [counter, setCounter, attach] = createSignal<number>(0)`
 
The way React implements the useState hook is by having a state array and a pointer to know which useState we are currently on. After the useState function is fired, it increments this pointer so that the next useState function will work with its state, and so on. 

We use a similar approach here, using a global signal store to keep track of the application state. The addition of the attacher function allows you to register listener functions to a signal/state that will be automatically triggered whenever the signal/state changes value.

### A little functional(ity)...

Inspired by Rust, Starship lets you do pattern matching in its signal setters or using the `match()` function.

```
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

```
<Show when={voyager}>
  <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/The_Sounds_of_Earth_Record_Cover_-_GPN-2000-001978.jpg/800px-The_Sounds_of_Earth_Record_Cover_-_GPN-2000-001978.jpg' />
</Show>
```

"Show the Voyager record image when the `voyager` evaluates to true!"