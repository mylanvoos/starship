export class Signal<T> {
    private value: T
    private subscribers = new Set<(value: T) => void>()
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
            this.notify()
        }
    }

    subscribe(callback: (value: T) => void): () => void {
        this.subscribers.add(callback)
        return () => this.subscribers.delete(callback)
    }
    private notify(): void {
        this.subscribers.forEach(callback => callback(this.value))

        this.effects.forEach((effect, key) => {
            if (!effect.condition || effect.condition(this.value)) {
                effect.fn()
            }
        })
    }
    addEffect(key: string, fn: Function, condition?: (value: T) => boolean): void {
        this.effects.set(key, { fn, condition })
    }
    removeEffects(key: string): void {
        this.effects.delete(key)
    }
}

