export class Signal<T> {
    private _value: T
    private _observers = new Map<string, Set<(value: T) => any>>()
    private _cache = new Map<string, any>() // stores computed values

    constructor(initialValue: T) {
        this._value = initialValue
    }
    get(): T { return this._value }

    getComputed(componentId: string, observerId: string): any {
        const key = `${componentId}:${observerId}`
        return this._cache.get(key)
    }

    set(newValue: T | ((currentValue: T) => T)): void {
        const resolved = typeof newValue === 'function'
            ? (newValue as (currentValue: T) => T)(this._value)
            : newValue;

        if (this._value !== resolved) {
            this._value = resolved;
            this.notifyAll();
        }
    }
    
    bind(componentId: string, callback: (value: T) => any, observerId?: string): void {
        if (!this._observers.has(componentId)) {
            this._observers.set(componentId, new Set())
        }
        this._observers.get(componentId)!.add(callback)

        if (observerId) {
            const result = callback(this._value)
            this._cache.set(`${componentId}:${observerId}`, result)
        }
    }

    unbind(componentId: string): void {
        this._observers.delete(componentId)
        for (const key of this._cache.keys()) {
            if (key.startsWith(`${componentId}`)) {
                this._cache.delete(key)
            }
        }
    }
    private notifyAll(): void {
        for (const [componentId, observers] of this._observers.entries()) {
            observers.forEach(callback => {
                const result = callback(this._value)

                if (result !== undefined) {
                    const observerEntries = Array.from(this._cache.entries())
                    const observerId = observerEntries.find(
                        ([key, val]) => key.startsWith(`${componentId}:`) && val === result
                    )?.[0]?.split(':')[1]
                    if (observerId) {
                        this._cache.set(`${componentId}:${observerId}`, result)
                    }
                }
                
            })
        }
    }
}
