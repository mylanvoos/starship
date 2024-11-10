import { Token, TokenType, Position } from "acorn"

export type ASTNode = {
    type: 'Element' | 'Text' | 'Attribute'
    tagName?: string
    attributes?: StarshipAttribute[]
    children?: ASTNode[]
    content?: string
}

export interface ElementNode extends ASTNode {
    type: 'Element'
    tagName: string
    attributes: AttributeNode[]
    children: ASTNode[]
}

export interface TextNode extends ASTNode {
    type: 'Text'
    content: string
}

export interface AttributeNode extends ASTNode {
    type: 'Attribute'
    name: string
    value: string
}

export interface CompilerOptions {
    sourceMap?: boolean
    prettify?: boolean
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

export interface ParserState {
    specialTags: Set<string>
    speciaTagsStack: Array<{
        name: string
        start: number
    }>
    currentAttributes: Set<StarshipAttribute>
}
