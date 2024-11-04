

export class Sentry {
    private listeners: Map<number, Set<Function>> = new Map()

    assign(signalId: number, callback: Function) {
        if (!this.listeners.has(signalId)) this.listeners.set(signalId, new Set())
        const signalListeners = this.listeners.get(signalId)!
        if (!signalListeners.has(callback)) signalListeners.add(callback)

    }
    notify(signalId: number, value: any) {
        // Sentry is notified that the value of the signal has changed
        if (this.listeners.has(signalId)) {
            const signalListeners = this.listeners.get(signalId)
            for (const listener of signalListeners) listener()
        }
    }
    dismiss(signalId: number, callback: Function) {
        if (this.listeners.has(signalId)) {
            const signalListeners = this.listeners.get(signalId)
            if (signalListeners.has(callback)) signalListeners.delete(callback)
        }
    }
}