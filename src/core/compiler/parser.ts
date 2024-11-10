import * as acorn from 'acorn'
import jsx from 'acorn-jsx'

import { StarshipTokeniser } from "./tokeniser"
import { ASTNode, ParserOptions, StarshipAttribute, StarshipToken } from './types'

const Parser = acorn.Parser.extend(jsx())

export class StarshipParser extends Parser {
    private length: number
    private tokens: StarshipToken[]
    private currentTokenIndex: number
    private ast: ASTNode[]
    private astString: string // nice JSON representation of the AST tree

    constructor(options: ParserOptions, source: string) {
        super(options, source)
        this.input = this.input.trim() // trim whitespaces

        this.tokens = new StarshipTokeniser(source).getTokens()
        this.currentTokenIndex = 0
        this.length = this.tokens.length
        this.ast = []

        this.read()
    }
    
    read() {
        while (this.currentTokenIndex < this.length) {
          this.ast.push(this.parseElement())
        }
        this.astString = JSON.stringify(this.ast, null, 2)

        console.log(this.astString)
    }

    parseElement(): ASTNode {
      if (this.currentTokenIndex >= this.length) throw new Error("Unexpected end of input");
      const token = this.tokens[this.currentTokenIndex]

      if (token.type === 'text') {
        this.currentTokenIndex++
        return {
          type: 'Text',
          content: token.content,
          tagName: null,
          attributes: [],
          children: [],
        }
      } else if (token.isClosing) {
        this.currentTokenIndex++
        return null
      } else if (token.isSelfClosing) {
        const tagName: string = token.type
        const attributes: StarshipAttribute[] = Array.from(token.attributes? token.attributes : [])

        this.currentTokenIndex++
        return {
          type: 'Element',
          tagName: tagName,
          attributes: attributes,
          children: [],
          content: token.content
        }
      } else {
        const tagName: string = token.type
        const attributes: StarshipAttribute[] = Array.from(token.attributes? token.attributes : [])
        let children: ASTNode[] = []
  
        this.currentTokenIndex++
  
        while (this.currentTokenIndex < this.length && !this.isClosingTagFor(token)) {
  
          const nestedElement: ASTNode = this.parseElement()
          if (nestedElement) {
            children.push(nestedElement)
          }
        }
        
        this.currentTokenIndex++
        return { 
          type: token.type === 'text'? 'Text' : 'Element',
          tagName: tagName,
          attributes: attributes,
          children: children,
          content: token.content
        }
      }
      
    }

    isClosingTagFor(token: StarshipToken): boolean {
      if (this.currentTokenIndex >= this.length) return false
      const currentToken = this.tokens[this.currentTokenIndex]
      return currentToken.type === token.type && currentToken.isClosing
    }

    getASTString(): string {
      return this.astString
    }
    getAST(): ASTNode[] {
      return this.ast
    }
}