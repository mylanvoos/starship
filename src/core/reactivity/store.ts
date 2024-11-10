// A global, centralised store to maintain a map/object of all signals
// Store is encapsulated within store.ts and is only accessible via createSignal

import { capitaliseFirstLetter } from "../utils";
import { match, _, MatchCase } from "../framework/framework";
import { Sentry } from "./sentry";
import { Signal, SignalGuard } from "./signal";

declare global {
    // Allow dynamic indexing of global scope with a string as key
    interface Window {
        [key: string]: any
    }
}

class SignalStore {
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

    createSignals<T extends Record<string, any>>(signalsObj: T): {
        [K in keyof T]: SignalGuard<T[K]>
    } {
        const result: Partial<Record<keyof T, SignalGuard<any>>> = {}
        for (const key in signalsObj) {
            const [getter, setter, attacher] = createSignal(signalsObj[key])
            result[key] = getter
            
            // Dynamicly-generated setter and attacher for each signal
            const setterName = `set${capitaliseFirstLetter(key)}`
            const attacherName = `attachTo${capitaliseFirstLetter(key)}`

            Object.defineProperty(globalThis, setterName, {
                value: setter,
                writable: true,
                configurable: true
            })
            Object.defineProperty(globalThis, attacherName, {
                value: attacher,
                writable: true,
                configurable: true
            })
        }
        return result as { [K in keyof T]: SignalGuard<T[K]> }
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
const storeInstance = new SignalStore()

export const createSignal = storeInstance.createSignal.bind(storeInstance)
export const createSignals = storeInstance.createSignals.bind(storeInstance)
export const isSignal = storeInstance.isSignal.bind(storeInstance)
export const resetStore = storeInstance.reset.bind(storeInstance)

// Keeping track of the current computation being executed
const computationContext = { current: null as Function | null };

export function getCurrentComputation() {
    return computationContext.current
}
export function setCurrentComputation(computation: Function | null) {
    computationContext.current = computation
}