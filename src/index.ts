import { createSignal } from "./core/reactivity/store"

const [counter, setCounter, attachToCounter] = createSignal<number>(0)
const [command, setCommand, attachToCommand] = createSignal<string>("")

setCounter(5)
console.log(counter())

attachToCounter(() => console.log("Counter changed:", counter()))
attachToCommand(() => {
    console.log("A command was given.")
    if (command() === "Reset counter!") setCounter(0)
    if (command() === "Counter to 5!") setCounter(5)
})

setCounter(10)
setCommand("Reset counter!")
