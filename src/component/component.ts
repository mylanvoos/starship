import { Signal } from "../signal"

export abstract class Component {
    private static nextId = 0
    protected readonly id: string
    protected parent: Component | null = null
    protected children: Component[] = []
    private signals = new Map<string, Signal<any>>()

    constructor() { this.id = `component-${Component.nextId++}`}

    protected createSignal<T>(name: string, initialValue: T): Signal<T> {
        
    }
}