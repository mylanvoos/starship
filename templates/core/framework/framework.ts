// Symbol defs
export const _ = Symbol('wildcard')
export const Some = Symbol('some')
export const None = Symbol('none')

/**
 * Option<T> - an optional value: either Some(T) or None 
 * Some<T> - the "Some" variant of Option, containing a value
 * None - the "None" variant of Option, representing an absence of value
 * Result<T, E> - a value or an error: either Ok(T) or Err(E)
 * Ok<T> - the "Ok" variant of Result, containing a value
 * Err<E> - the "Err" variant of Result, containing an error
 */
export type Option<T> = Some<T> | None
export type Some<T> = { type: typeof Some, value: T }
export type None = { type: typeof None }
export type Result<T, E> = Ok<T> | Err<E>
export type Ok<T> = { type: 'Ok', value: T }
export type Err<E> = { type: 'Err', error: E }

/**
 * Creates a "Some" variant with a given value
 * @param value - value to wrap in "Some"
 * @returns an Option containing the value
 */
export const some = <T>(value: T): Some<T> => ({ type: Some, value })

/**
 * The singleton instance of "None"
 */
export const none: None = { type: None }

/**
 * Creates an "OK" result with the given value
 * @param value - value to wrap in "Ok"
 * @returns  a Result containing the value
 */
export const ok = <T>(value: T): Ok<T> => ({ type: 'Ok', value })

/**
 * Same as "ok", this is an "Err" result with a given error
 * @param error 
 * @returns 
 */
export const err = <E>(error: E): Err<E> => ({ type: 'Err', error })


// syntactic wrappers
export function when(predicate: (value: any) => boolean) {
    return { predicate }
}
// a bit redundant ?
export function effect<T>(value: T) {
    return value
}

/**
 * guard - returns "Some" if a predicate is met, otherwise returns "None"
 * @param value - value to evaluate.
 * @param predicate - function to test the value.
 * @returns an Option: "Some" if the predicate is true, else "None"
 */
export function guard<T>(value: T, predicate: (value: T) => boolean): Option<T> {
    return predicate(value) ? some(value) : none
}

// Defines various patterns for matching
export type Pattern<T> =
    | T // literal
    | { predicate: (value: any) => boolean } // conditional
    | typeof _ // wildcard
    | typeof Some // match to Option Some
    | typeof None // match to Option None
    | RegExp
    | [Pattern<any>, ...Pattern<any>[]] // tuple pattern
    | { [K in keyof T]?: Pattern<T[K]> } // object pattern

export type MatchCase<T, R> = [Pattern<T>, R | ((value: T) => R)]

/**
 * match - Evals a value against multiple patterns, returning the result of the first matching pattern
 * @param value - value to match
 * @param cases - array of patterns and results or functions
 * @returns result of the first matched pattern
 * @throws error if no match is found.
 */
export function match<T, R>(value: T, cases: MatchCase<T, R>[]): R {
    for (const [pattern, result] of cases) {
        if (isMatch(value, pattern)) {
            return typeof result === 'function' ?
                (result as (value: T) => R)(value) :
                result
        }
    }
    throw new Error('No match found')
}

/**
 * isMatch - Checks if a value matches a given pattern
 * @param value - value to test
 * @param pattern - pattern to match against
 * @returns bool if the value matches the pattern
 */
function isMatch(value: any, pattern: Pattern<any>): boolean {
    if (pattern === _) {
        return true
    }
    if (pattern === Some && isOption(value) && value.type === Some) {
        return true
    }
    if (pattern === None && isOption(value) && value.type === None) {
        return true
    }
    if (pattern instanceof RegExp && typeof value === 'string') {
        return pattern.test(value)
    }
    if (typeof pattern === 'object' && pattern.predicate) {
        return pattern.predicate(value)
    }
    if (Array.isArray(pattern) && Array.isArray(value)) {
        return pattern.length === value.length &&
            pattern.every((p, i) => isMatch(value[i], p))
    }
    if (typeof pattern === 'object' && pattern !== null && typeof value === 'object' && value !== null) {
        return Object.entries(pattern).every(([key, p]) =>
            key in value && isMatch(value[key], p))
    }
    // catch-all
    return Object.is(value, pattern)
}
/**
 * isOption - Type guard to check if a value is an Option
 * @param value - value to check
 * @returns bool if the value is an Option
 */
function isOption<T>(value: any): value is Option<T> {
    return value && (
        value.type === Some && 'value' in value ||
        value.type === None
    )
}

/**
 * range - Generates an array from a starting point to an endpoint with a specified step
 * @param from - starting value
 * @param to - end value
 * @param step - Optional function to define the step
 * @returns an array from the start to the end value
 */
export function range<T>(from: T, to: T, step?: (value: T) => T): Array<T> {
    const result: Array<T> = []
    let current = from
    const stepFunction = step ? step : getStepFunction(from, to)

    while (!Object.is(current, to)) {
        result.push(current)
        current = stepFunction(current)
        if (Object.is(current, from)) {
            throw new Error('Infinite loop detected: "step" function did not progress the value')
        }
    }

    result.push(to)
    return result
}

function getStepFunction<T>(from: T, to: T): (value: any) => any {
    if (typeof from === 'number' && typeof to === 'number') {
        const step = from <= to ? 1 : -1
        return (n: number) => n + step as any
    }

    if (typeof from === 'string' && typeof to === 'string' && from.length === 1 && to.length === 1) {
        const step = from <= to ? 1 : -1
        return (char: string) => String.fromCharCode(char.charCodeAt(0) + step) as any
    }

    if (from instanceof Date && to instanceof Date) {
        const step = from <= to ? 1 : -1
        return (date: Date) => new Date(date.getTime() + step * 24 * 60 * 60 * 1000) as any
    }

    if (isOption(from) && isOption(to)) {
        throw new Error('Cannot create range for Option types!')
    }

    throw new Error('Invalid type and steps for the range function! Provide a custom step function.')
}

// Utility for working with Options
/**
 * unwrapOr - Safely unwraps an Option, returning a default value if None
 * @param option - the Option to unwrap
 * @param defaultValue - value to return if Option is None
 * @returns the unwrapped value or the default
 */
export const unwrapOr = <T>(option: Option<T>, defaultValue: T): T => option.type === Some ? option.value : defaultValue

/**
 * unwrap - Unsafely unwraps an Option, throwing an error if None
 * @param option - the Option to unwrap
 * @throws Error if the Option is None
 */
export const unwrap = <T>(option: Option<T>): T => {
    if (option.type === Some) return option.value
    throw new Error('Called unwrap on a None value!')
}