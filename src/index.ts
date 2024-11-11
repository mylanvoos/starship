export { createSignals, createSignal } from './core/reactivity'
export { Show, h, Fragment } from './core/dom'
export { match } from './core/framework'
import App from './App.uss'
import { ASTNode } from './core/compiler/types'

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

// recursively flatten nested arrays (handling nested elements vs single elements)
function flattenElements(elements: ASTNode[]) {
    const result = []
    for (const el of elements) {
        if (Array.isArray(el)) {
            result.push(...flattenElements(el))
        } else {
            result.push(el)
        }
    }
    return result
}

if (isBrowser) {
    const appElement = App()
    const flatElements = flattenElements(appElement)

    for (const node of flatElements) {
        if (node instanceof Node) {
            document.getElementById('app')!.appendChild(node)
        }
    }
}