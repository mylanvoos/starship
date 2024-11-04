// takes in the element type, props, and children, then returns a virtual DOM representation
export function h(
    type: string | Function,
    props: Record<string, any> | null,
    ...children: any[]
): HTMLElement {
    if (typeof type === 'string') {
        const element = document.createElement(type)

        if (props) {
            Object.entries(props).forEach(([key, value]) => {
                if (key.startsWith('on')) {
                    element.addEventListener(key.toLowerCase().slice(2), value)
                } else {
                    element.setAttribute(key, value)
                }
            })
        }

        children.flat().forEach(child => {
            if (typeof child === 'string' || typeof child === 'number') {
                element.appendChild(document.createTextNode(child.toString()))
            } else if (child instanceof HTMLElement) {
                element.appendChild(child)
            }
        })

        return element
    }

    return type({ ...props, children })
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
