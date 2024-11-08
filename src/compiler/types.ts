export type Token = {
    type: 'TagOpen' | 'TagClose' | 'Attribute' | 'Directive' | 'Expression' | 'Text' | 'Element'
    value: string
    content?: string
    selfClosing?: boolean
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
