import { Store } from "./core/reactivity/store";

const store = new Store()

const [counter, setCounter, attach] = store.createSignal<number>(0)

console.log(counter())
setCounter(5)
console.log(counter())

attach(() => console.log("Counter changed:", counter()))
attach(() => console.log("Performing addition upon counter change:", adder(counter(), 6)))

function adder(a: number, b: number): number { return a + b }

setCounter(10)
setCounter(20)