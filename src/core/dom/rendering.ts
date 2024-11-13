import { SignalGuard } from "../reactivity/signal";
import { setCurrentComputation } from "../reactivity/store";
import { appendChild, applyProps, insertChildNode } from "./utils";

export function h(
  tag: any,
  props?: { [key: string]: any },
  ...children: any[]
): HTMLElement {
  if (tag instanceof Node) return tag as HTMLElement
  if (typeof tag === 'function') return tag({ ...props, children })

  const element = document.createElement(tag);
  applyProps(element, props)

  children.flat().forEach((child) => appendChild(element, child))
  return element
}

export const Fragment = (props: { children: any[] }) => props.children

// Checks if when is a signal and assigns update to its listeners in Sentry
export function Show(props: { when: (() => boolean) | SignalGuard<boolean>; children: any[] }): Comment {
  const { when, children } = props
  const container = document.createComment("Show")
  let currentChildNodes: Node[] = []

  const evaluateWhen = () => {
    if (typeof when === 'function') {
      return when()
    }
    if (when instanceof SignalGuard) {
      return when.value
    }
    return Boolean(when)
  }

  const update = () => {
    const parent = container.parentNode
    if (!parent) return

    currentChildNodes.forEach((child) => parent.removeChild(child))
    currentChildNodes = []

    // conditional rendering
    if (evaluateWhen()) {
      children.flat().forEach((child) => {
        const insertedNode = insertChildNode(parent, container.nextSibling, child)
        if (insertedNode) currentChildNodes.push(insertedNode)
      })
    }
  }

  if (when instanceof SignalGuard) {
    when.signal.sentry.assign(when.signal.id, update)
  } else if (typeof when === 'function') {
    // start tracking, then eval 'when' once so that any signals accessed will register `update` as a listener
    // only signals accessed during the evaluation of `when` are tracked
    setCurrentComputation(update)
    evaluateWhen()
    setCurrentComputation(null)
  }

  // defer the initial update() call until after component has been attached to DOM
  // previously calling update() right away causes const parent = container.parentNode to be null
  Promise.resolve().then(update)
  return container
}

/**
 * Looping over elements in array
 * <For each={signal3}>
    {(item, index) => (
      <div>
        Item {index}: {item}
      </div>
    )}
 * </For>
 * 
 * Looping over a range of indices
 * <For each={Array.from({ length: signal3 }, (_, index) => index)} range={true}>
    {(index) => (
      <div>
        Index: {index}
      </div>
    )}
 * </For>
 * Using the `T extends number` constraint here because props.each will always be an array of numbers (when props.range)
 */
export function For<T extends number>(props: {
  each: T[]
  range?: boolean; // if <For {item}:in:{array}> or <For {index}:range:{array.length}>
  children: [(itemOrIndex: T | number, index?: number) => any]
}): DocumentFragment {

  // Hold all generated element
  const container = document.createDocumentFragment()
  const childFunction = props.children[0]

  if (props.range) {
    props.each.forEach((index: number) => {
      appendChild(container, childFunction(index))
    })
  } else {
    props.each.forEach((item: T, index: number) => {
      appendChild(container, childFunction(item, index))
    })
  }

  return container
}

