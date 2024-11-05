import { isSignal } from "../reactivity/store";

export function h(tag: any, props: any, ...children: any[]): HTMLElement {
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

        // TODO: Sort this out properly
        const textNode = document.createTextNode(child.value)
        element.appendChild(textNode)
        child.sentry.assign(child.id, () => textNode.textContent = child.value)

      } else if (child instanceof Node) {
        element.appendChild(child)
        
      } else {
        element.appendChild(document.createTextNode(child.toString()))
      }
    }

    children.flat().forEach(appendChild)

    return element;
}

export const Fragment = (props: { children: any[] }) => props.children


export const _ = Symbol('wildcard')

// syntactic wrappers
export function when(predicate: (value: any) => boolean) {
    return { predicate }
}
export function effect<T>(value: T)  {
    return value
}

export type Pattern<T> = 
    | T // literal
    | { predicate: (value: any) => boolean } // conditional
    | typeof _ // wildcard

export type MatchCase<T, R> = [Pattern<T>, R]

export function match<T, R>(value: T, cases: MatchCase<T, R>[]): R {
    for (const [pattern, result] of cases) {
        if (pattern === _) {
            return typeof result === 'function' ? result() : result
        } else if (typeof pattern === 'object' && 'predicate' in pattern) {
            if (pattern.predicate(value)) {
                return typeof result === 'function' ? result() : result;
            }
        } else {
            if (value === pattern) {
                return typeof result === 'function' ? result() : result;
            }
        }
    }
    throw new Error('No match found')
}
