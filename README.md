## Starship.js - Yet another JavaScript framework ###

This is an experiment in making a frontend framework that is *reactive*, can *manage the application state* and *manipulate the DOM*, and has a *component-based architecture*. It also has a little bit of (optional) functional programming.

Inspired by React, Vue, and Solid.js

### Reactivity: an attempt at recreating React's useState hook from scratch

`const [counter, setCounter, attach] = createSignal<number>(0)`
 
The way React implements the useState hook is by having a state array and a pointer to know which useState we are currently on. After the useState function is fired, it increments this pointer so that the next useState function will work with its state, and so on. 

We use a similar approach here. The addition of the attacher function allows you to register listener functions to a signal/state that will be automatically triggered whenever the signal/state changes value.

### A little functional(ity)...

Inspired by Rust, Starship lets you do pattern matching in its signal setters or using the `match()` function.

```
const [counter, setCounter, attachToCounter] = createSignal<number>(0)
const [message, setMessage, attachToMessage] = createSignal<string>('')

attachToCounter(() => setMessage(counter(), [
    [ when(v => v >= 10 || v <= -10), effect("Cannot exceed +=10!") ],
    [ when(v => v === 0), effect("Press a button to get started.")] ,
    [ _, effect(`Counter: ${counter()}`) ]
]))
```

attachToMessage(() => p.textContent = message())`
