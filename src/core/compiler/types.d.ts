import { Token, TokenType, Position } from "acorn"

export type ASTNode = {
    type: 'Element' | 'Text' | 'Attribute'
    tagName?: string
    attributes?: StarshipAttribute[]
    children?: ASTNode[]
    content?: string
}

export interface StarshipAttribute {
    name: string
    value: string
    // value: string | boolean | null
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
