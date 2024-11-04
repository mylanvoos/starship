// A global, centralised store to maintain a map/object of all signals
// Store is encapsulated within store.ts and is only accessible via createSignal

import { match, _, MatchCase } from "../framework/framework";
import { Sentry } from "./sentry";
import { Signal } from "./signal";

class Store {
    private signals: Map<number, Signal<any>> = new Map()
    private index: number  = 0
    private sentry: Sentry = new Sentry()
    
    createSignal<T>(initialValue?: T): [
        getter: Getter<T>,
        setter: Setter<T>,
        attacher: (listener: Function) => void
    ] {
        const localIndex = this.index // freeze index to make setters work

        if (!this.signals.has(localIndex)) this.signals.set(localIndex, new Signal<T>(initialValue, localIndex, this.sentry))
        this.index++

        const signal = this.signals.get(localIndex)!

        // dynamic getter
        const getter: Getter<T> = {
            get value() {
                return signal.get()
            }
        }
        const setter: Setter<T> = ((...args: any[]) => {
            if (args.length === 1) {
                const newValue: T = args[0]
                signal.set(newValue)
            } else if (args.length === 2) {
                const pred: any = args[0]
                const cases: MatchCase<any, T>[] = args[1]
                const result = match(pred, cases)
                signal.set(result)
            } else {
                throw new Error('Setter called with invalid number of arguments')
            }
        }) as Setter<T>

        const attacher = (listener: Function) => signal.sentry.assign(localIndex, listener)

        return [getter, setter, attacher]
    }

    reset() {
        // reset index for rerendering
        this.index = 0
    }
}

type Setter<T> = {
    (newValue: T): void
    (pred: any, cases: MatchCase<any, T>[]): void
}

type Getter<T> = {
    value: T
}

// Exporting createSignal so it can be used globally without exposing Store
const storeInstance = new Store()
export const createSignal: <T>(initialValue?: T) => [
    getter: Getter<T>,
    setter: Setter<T>,
    attacher: (listener: Function) => void
] = storeInstance.createSignal.bind(storeInstance)

export const resetStore = storeInstance.reset.bind(storeInstance)