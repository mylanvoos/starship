export class Signal<T> {
    private value: T
    private observers = new Set<(value: T) => void>()
    private effects = new Map<string, { fn: Function, condition?: (value: T) => boolean}>()

    constructor(initialValue: T) {
        this.value = initialValue
    }
    get(): T { return this.value }

    set(newValue: T | ((currentValue: T) => T)): void {
        const resolved = typeof newValue === 'function'
            ? (newValue as (currentValue: T) => T)(this.value)
            : newValue

        if (this.value !== resolved) {
            this.value = resolved
            this.notifyAll()
        }
    }
    
    
}
