### Starship.js - Yet another JavaScript framework ###

This is an experiment in making a frontend framework that is *reactive*, can *manage the application state* and *manipulate the DOM*, and has a *component-based architecture*.

Inspired by React, Vue, and Solid.js

# Reactivity: an attempt at recreating React's useState hook from scratch

`const [counter, setCounter, attach] = createSignal<number>(0)`
 
The way React implements the useState hook is by having a state array and a pointer to know which useState we are currently on. After the useState function is fired, it increments this pointer so that the next useState function will work with its state, and so on. 