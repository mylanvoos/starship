export class Signal<T = any> {
    private _value: T
    private dependency: Set<Function> = new Set()

    constructor(val: T) {
        this._value = this._makeReactive(val)
    }
    private _makeReactive(obj: any): any {
        if (typeof obj !== 'object' || obj === null) return obj

        // recursively make children elements reactive
        if (Array.isArray(obj)) {
            return obj.map(item => this._makeReactive(item))
        }

        const reactiveObj: Record<string, any> = {}
        for (const key in obj) reactiveObj[key] = new Signal(obj[key])

        return new Proxy(reactiveObj, {
            // when accessing a property, retrieves the value of the Signal (e.g., reactiveObj[prop].value)
            get: (target, prop) => { return target[prop as keyof typeof target]?.value },
            set: () => {
                console.warn("Direct mutation is not allowed. Use set()")
                return true
            }
        })
    }
    // getter and setter
    get value(): T { return this._value }

    set(setter: T | ((currentValue: T) => T)) {
        const newValue = typeof setter === "function" ? (setter as Function)(this.value) : setter 
        this._value = this._makeReactive(newValue)
        this.notify()
    }

    subscribe(callback: Function) { this.dependency.add(callback) }

    unsubscribe(callback: Function) { this.dependency.delete(callback) }

    notify() {
        this.dependency.forEach(callback => callback())
    }
}
