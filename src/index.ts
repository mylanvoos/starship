import { createSignal, Signal } from "./core/signals/signal";


const [counter, setCounter, attach] = createSignal<number>(0)

console.log(counter)
setCounter(5)
console.log(counter)

attach(() => console.log("Counter changed:", counter))

setCounter(10)
