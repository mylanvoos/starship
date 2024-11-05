export declare namespace JSX {
    export interface Element extends HTMLElement {
        render(): HTMLElement
    }

    export interface InstrinsicElements {
        [elementName: string]: any
    }
}

// JSX factory function
export declare function h(
    type: string | Function,
    props: Record<string, any> | null,
    ...children: any[]
): HTMLElement

export declare function Fragment(props: { children: any[] }): any

export {}