import { Sentry } from "./sentry"
import { getCurrentComputation } from "./store"

export class Signal<T> {
    private value: T
    readonly id: number
    sentry: Sentry

    constructor(val: T, id: number, sentry: Sentry) { 
        this.value = val
        this.id = id,
        this.sentry = sentry
     }
    get(): T { return this.value }
    set(newVal: T): void {
        if (newVal !== this.value) {
            this.value = newVal
            this.sentry.notify(this.id, newVal)
        }
    }
}

export class SignalGuard<T> {
    readonly signal: Signal<T>
    get value(): T {
        // TODO: Remove current computation from sentry listener 
        // after the relevant component has been unmounted or removed from the DOM for optimisation
        if (typeof getCurrentComputation() === 'function') {
            this.signal.sentry.assign(this.signal.id, getCurrentComputation())
        }
        return this.signal.get() 
    }
    constructor(signal: Signal<T>) {
        this.signal = signal
    }
    toString(): string {
        return this.value.toString()
    }
}