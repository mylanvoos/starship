import { Token, TokenType, Position, Options } from "acorn"
import { StarshipTokeniser } from "./tokeniser"

/** Technically a lot of these do not have to be mandatory, but it's to prevent bugs */
export interface ASTNode extends Node {
    type: 'Element' | 'Text' | 'Attribute'
    tagName: string
    attributes: StarshipAttribute[]
    children: ASTNode[]
    content: string
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

export interface ParserOptions extends Options {
    ecmaVersion: ecmaVersion
    tokeniser: StarshipTokeniser
}

export interface ForAttributesMode {
    display: string
    isRange: boolean,
    item: string
}
export { }