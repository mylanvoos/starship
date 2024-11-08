export type Token = {
    type: 'Tag' | 'Attribute' | 'Directive' | 'Expression' | 'Text'
    value: string
    content: string
}

export type ASTNode = {
    type: 'Element' | 'Text' | 'Expression'
    tag?: string
    attribute?: Record<string, string | Expression>
    children?: ASTNode[]
}

export type Expression = {
    type: 'Expression'
    value: string | Function
    // might do a function here
}
