import { Signal } from "./signal";

const nestedSignal = new Signal({ a: { b: 2 }, c: [1, 2, 3] })
nestedSignal.subscribe(() => console.log("Signal changed:", nestedSignal.value))

nestedSignal.set((prev) => ({
    ...prev,
    a: { ...prev.a, b: 5 }
}))
