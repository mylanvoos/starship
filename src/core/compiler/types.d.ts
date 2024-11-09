import { Token, TokenType, Position } from "acorn"

export type ASTNode = {
    type: 'Element' | 'Text' | 'Expression'
    tag?: string
    attribute?: Record<string, string>
    children?: ASTNode[]
    value?: string
}

export interface CompilerOptions {
    sourceMap?: boolean
    prettify?: boolean
}

export interface StarshipAttribute {
    type: 'class' | 'id' | 'event' | 'path' | 'attribute' | 'type'
    name?: string
    value: string | boolean | null
}

export interface StarshipToken extends Token {
    type: string
    isClosing?: boolean
    isSelfClosing?: boolean
    attributes?: Set<StarshipAttribute>
    start?: number
    end?: number
    content?: string
}

export interface ParserState {
    specialTags: Set<string>
    speciaTagsStack: Array<{
        name: string
        start: number
    }>
    currentAttributes: Set<StarshipAttribute>
}

export type StarshipTokenType = TokenType & {
    updateContent?: (prevType: TokenType) => void
}