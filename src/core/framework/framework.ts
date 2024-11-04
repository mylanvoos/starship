export const _ = Symbol('wildcard')

// syntactic wrappers
export function when<T>(predicate: (value: T) => boolean) {
    return { predicate }
}
export function effect<T>(value: T)  {
    return value
}

type Pattern<T> = 
    | T // literal
    | { predicate: (value: T) => boolean } // conditional
    | typeof _ // wildcard

type MatchCase<T, R> = [Pattern<T>, R]

export function match<T, R>(value: T, cases: MatchCase<T, R>[]): R {
    for (const [pattern, result] of cases) {
        if (pattern === _) {
            return result
        } else if (typeof pattern === 'object' && 'predicate' in pattern) {
            if (pattern.predicate(value)) {
                return result
            }
        } else {
            if (value === pattern) {
                return result
            }
        }
    }
    throw new Error('No match found')
}
