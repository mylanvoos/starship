
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

export function createSignal<T>(initialValue: T): [T, (newValue: T) => void, (listener: Function) => void] {
    const signal = new Signal(initialValue)
    const getValue = () => signal.get()
    const setValue = (newValue: T) => signal.set(newValue)
    const attachTo = (listener: Function) => { signal.attach(listener) }
    return [getValue(), setValue, attachTo]
}
