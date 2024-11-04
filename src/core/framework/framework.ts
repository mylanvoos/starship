export function h(tag: string | Function, props: any, ...children: any[]): HTMLElement {
    if (typeof tag === 'function') {
      return tag(props);
    }
  
    const element = document.createElement(tag);
  
    for (const name in props) {
      if (name.startsWith('on') && typeof props[name] === 'function') {
        element.addEventListener(name.slice(2).toLowerCase(), props[name]);
      } else {
        element.setAttribute(name, props[name]);
      }
    }
  
    for (const child of children) {
      element.appendChild(
        child instanceof Node ? child : document.createTextNode(child)
      );
    }
  
    return element;
  }
  

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
