
export class Signal<T> {
    private value: T
    private listeners: Set<Function> = new Set()

    constructor(val: T) { this.value = val }
    get(): T { return this.value }
    set(newVal: T): void {
        if (newVal !== this.value) {
            this.value = newVal
            this.notifyListeners()
        }
    }
    attach(listener: Function) {
        if (!this.listeners.has(listener)) this.listeners.add(listener)
    }
    private notifyListeners(): void {
        for (const listener of this.listeners) {
            listener(this.value)
        }
    }
    
}
