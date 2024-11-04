// A global, centralised store to maintain a map/object of all signals
// Store is encapsulated within store.ts and is only accessible via createSignal

import { Sentry } from "./sentry";
import { Signal } from "./signal";


class Store {
    private signals: Map<number, Signal<any>> = new Map()
    private index: number  = 0
    private sentry: Sentry = new Sentry()
    
    createSignal<T>(initialValue?: T): [
        getter: () => T,
        setter: (newValue: T) => void,
        attacher: (listener: Function) => void
    ] {
        const localIndex = this.index // freeze index to make setters work

        if (!this.signals.has(localIndex)) this.signals.set(localIndex, new Signal<T>(initialValue, localIndex, this.sentry))
        this.index++

        const signal = this.signals.get(localIndex)!

        const getter = () => signal.get()
        const setter = (newState: T) => signal.set(newState)
        const attacher = (listener: Function) => signal.sentry.assign(localIndex, listener)

        return [getter, setter, attacher]
    }
}

// Exporting createSignal so it can be used globally without exposing Store
const storeInstance = new Store()
export const createSignal: <T>(initialValue?: T) => [
    getter: () => T,
    setter: (newValue: T) => void,
    attacher: (listener: Function) => void
] = storeInstance.createSignal.bind(storeInstance)