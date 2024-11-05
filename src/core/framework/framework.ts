import { isSignal } from "../reactivity/store";

// Rendering
export function h(tag: any, props?: any, ...children: any[]): HTMLElement {
    if (typeof tag === 'function') {
      return tag({ ...props, children });
    }
  
    const element = document.createElement(tag);

    if (props) {
      for (const name in props) {
        if (name.startsWith('on') && typeof props[name] === 'function') {
          element.addEventListener(name.slice(2).toLowerCase(), props[name]);
        } else if (name === 'className' || name === 'class' ) {
          element.setAttribute('class', props[name])
        } else {
          element.setAttribute(name, props[name]);
        }
      }
    }

    function appendChild(child: any) {
      if (child == null || child === false) return

      if (Array.isArray(child)) {
        child.forEach(appendChild) // recursive

      } else if (isSignal(child)) {
        const textNode = document.createTextNode(child.value)
        element.appendChild(textNode)
        child.signal.sentry.assign(child.signal.id, () => textNode.textContent = child.value)

      } else if (child instanceof Node) {
        console.log(child)
        element.appendChild(child)
        
      } else {
        element.appendChild(document.createTextNode(child.toString()))
      }
    }

    children.flat().forEach(appendChild)

    return element;
}

export const Fragment = (props: { children: any[] }) => props.children
// Pattern matching

export const _ = Symbol('wildcard')

// syntactic wrappers
export function when(predicate: (value: any) => boolean) {
    return predicate 
}
export function effect<T>(value: T)  {
    return value
}

export type Pattern<T> = 
    | T // literal
    | { predicate: (value: any) => boolean } // conditional
    | typeof _ // wildcard

export type MatchCase<T, R> = [Pattern<T>, R]

// Match enforces the use of the wildcard (consider all cases)
export function match<T, R>(value: T, cases: MatchCase<T, R>[]): R {
    for (const [pattern, result] of cases) {
      let isMatch = false
      if (pattern === _) {
          isMatch = true
      } else if (typeof pattern === 'function') {
          isMatch = (pattern as (value: T) => boolean)(value)
      } else {
          isMatch = value === pattern
      }

      if (isMatch) {
          return typeof result === 'function' ? (result as () => R)() : result
      }
    }
    throw new Error('No match found')
}
