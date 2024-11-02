import { Signal } from "./signal";

const nestedSignal = new Signal({ a: { b: 2 }, c: [1, 2, 3] })
nestedSignal.subscribe(() => console.log("Signal changed:", nestedSignal.value))

nestedSignal.set((prev) => ({
    ...prev,
    a: { ...prev.a, b: 5 }
}))
console.log(nestedSignal.value.a)

const countSignal = new Signal(0)
countSignal.subscribe(() => console.log("Count has changed to:", countSignal.value))
countSignal.subscribe(() => console.log("Also triggered"))
countSignal.set(prev => prev + 1)