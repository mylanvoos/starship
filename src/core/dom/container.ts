import { resetStore } from "../reactivity/store"

export interface Component {
    render(): HTMLElement
}

export class Container {
    private component: Component

    constructor(component: Component) { this.component = component }

    render(): HTMLElement {
        resetStore()
        return this.component.render()
    }
}
