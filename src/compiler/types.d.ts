import { Token, TokenType } from "acorn"

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

export interface StarshipAttribute {
    type: 'class' | 'id' | 'event' | 'path' | 'attribute'
    name?: string
    value: string | boolean | null
}

export interface StarshipToken extends Token {
    value?: {
        name: string
        isClosing?: boolean
        attributes?: Set<StarshipAttribute>
        start?: number
        end?: number
        content?: string
    }
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