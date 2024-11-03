// A global, centralised store to maintain a map/object of all signals

import { Signal } from "./signal";


export class Store {
    private signals: Map<number, Signal<any>> = new Map()
    private index: number  = 0
    
    createSignal<T>(initialValue?: T): [
        getter: () => T,
        setter: (newValue: T) => void,
        attacher: (listener: Function) => void
    ] {
        const localIndex = this.index // freeze index to make setters work

        if (!this.signals.has(localIndex)) this.signals.set(localIndex, new Signal<T>(initialValue))
        this.index++

        const getter = () => this.signals.get(localIndex)?.get()
        const setter = (newState: T) => this.signals.get(localIndex)?.set(newState)
        const attacher = (listener: Function) => this.signals.get(localIndex)?.attach(listener) 

        return [getter, setter, attacher]
    }
}