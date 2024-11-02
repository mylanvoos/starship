import { Signal } from "../reactivity/signal"

export abstract class Component {
    private static nextId = 0
    protected readonly id: string
    protected parent: Component | null = null
    protected children: Component[] = []
    private signals = new Map<string, Signal<any>>()

    constructor() { this.id = `component-${Component.nextId++}`}

    protected createSignal<T>(name: string, initialValue: T): Signal<T> {
        if (!this.signals.has(name)) {
            this.signals.set(name, new Signal(initialValue))
        }
        return this.signals.get(name) as Signal<T>
    }
    protected getParentSignal<T>(name: string): Signal<T> | null {
        if (!this.parent) return null
        return this.parent.getSignalByName(name)
    }
    private getSignalByName<T>(name: string): Signal<T> | null {
        return this.signals.get(name) as Signal<T> | null
    }
    // add protected
    addChild(child: Component): void {
        child.parent = this 
        this.children.push(child)
    }
    destroy(): void {
        for (const signal of this.signals.values()) {
            signal.unbind(this.id)
        }
        this.children.forEach(child => child.destroy())
     }
}