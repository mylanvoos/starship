import { isSignal } from "../reactivity/store";
import { h } from '../framework/framework'

// Checks if when is a signal and assigns update to its listeners in Sentry
export function Show(props: { when: any; children: any[] }): Comment {
    const { when, children } = props
    const container = document.createComment("Show")
    let currentChildNodes: Node[] = []

    const update = () => {
        console.log("Update triggered")
        const parent = container.parentNode
        if (!parent) return

        currentChildNodes.forEach((child) => parent.removeChild(child))
        currentChildNodes = []

        if (isSignal(when) ? when.value : when) {

            const newChildren = children.flat().map((child) => {
                const { tag, props = {}, children = [] } = typeof child === 'object' && child !== null
                ? child
                : { tag: child, props: {}, children: [] }
                const element = h(tag, props, ...children)
                return element instanceof Node ? element : null
            }).filter((el) => el !== null)
            newChildren.forEach((child) => {
                parent.insertBefore(child, container.nextSibling)
                currentChildNodes.push(child)
            })
        }
    }

    if (isSignal(when)) {
        when.signal.sentry.assign(when.signal.id, update)
    }

    update()

    return container
}