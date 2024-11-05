// A global, centralised store to maintain a map/object of all signals
// Store is encapsulated within store.ts and is only accessible via createSignal

import { match, _, MatchCase } from "../framework/framework";
import { Sentry } from "./sentry";
import { Signal, SignalGuard } from "./signal";

class Store {
    private signals: Map<number, Signal<any>> = new Map()
    private index: number  = 0
    private sentry: Sentry = new Sentry()
    
    createSignal<T>(initialValue?: T): [
        getter: SignalGuard<T>,
        setter: Setter<T>,
        attacher: (listener: Function) => void
    ] {
        const localIndex = this.index // freeze index to make setters work

        if (!this.signals.has(localIndex)) this.signals.set(localIndex, new Signal<T>(initialValue, localIndex, this.sentry))
        this.index++

        const signal = this.signals.get(localIndex)!

        const getter = new SignalGuard(signal)

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

    isSignal(object: any): boolean {
        return object instanceof SignalGuard
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

// Exporting createSignal so it can be used globally without exposing Store
const storeInstance = new Store()
export const createSignal: <T>(initialValue?: T) => [
    getter: SignalGuard<T>,
    setter: Setter<T>,
    attacher: (listener: Function) => void
] = storeInstance.createSignal.bind(storeInstance)

export const isSignal: (object: any) => boolean = storeInstance.isSignal.bind(storeInstance)
export const resetStore = storeInstance.reset.bind(storeInstance)



// Keeping track of the current computation being executed
const computationContext = { current: null as Function | null };

export function getCurrentComputation() {
    return computationContext.current
}
export function setCurrentComputation(computation: Function | null) {
    computationContext.current = computation
}