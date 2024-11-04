import { Sentry } from "./sentry"

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
