import { Store } from "./core/signals/store";

const store = new Store()

const [counter, setCounter, attach] = store.createSignal<number>(0)

console.log(counter())
setCounter(5)
console.log(counter())

attach(() => console.log("Counter changed:", counter()))

setCounter(10)
