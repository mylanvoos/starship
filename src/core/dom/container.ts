import { resetStore } from "../reactivity/store"

export interface Component {
    render(): JSX.Element | HTMLElement
}

export class ComponentBase implements Component {
    render(): JSX.Element | HTMLElement {
      throw new Error('Render method not implemented');
    }
  }

type SignalProp<T> = {
    value: T
    __isSignal: true // type guard
}

export class Container {
    private component: Component

    constructor(component: Component) { this.component = component }

    render(): HTMLElement {
        resetStore()
        return this.component.render()
    }
}
