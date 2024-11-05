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
