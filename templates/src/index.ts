// This is the main entry point of your application.

export { createSignals, createSignal } from '../core/reactivity'
export { Show, h, Fragment } from '../core/dom'
export { match } from '../core/framework'

// @ts-ignore
import App from './App.uss'
import './index.css'

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

/**
 * Recursively flatten nested arrays (handling nested elements vs single elements)
 * @param elements : ASTNode[]
 * @returns ASTNode[]
 */
function flattenElements(elements) {
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
  console.log(appElement)
  const flatElements = flattenElements(appElement)

  for (const node of flatElements) {
    if (node instanceof Node) {
      document.getElementById('app')!.appendChild(node)
    }
  }
}