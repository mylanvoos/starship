export const _ = Symbol('wildcard')

// syntactic wrappers
export function when(predicate: (value: any) => boolean) {
    return { predicate }
}
export function effect<T>(value: T)  {
    return value
}

type Pattern<T> = 
    | T // literal
    | { predicate: (value: any) => boolean } // conditional
    | typeof _ // wildcard

type MatchCase<T, R> = [Pattern<T>, R]

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
