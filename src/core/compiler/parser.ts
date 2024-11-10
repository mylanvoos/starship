import * as acorn from 'acorn'
import jsx from 'acorn-jsx'

import { tokeniser } from "./tokeniser"
import { ASTNode, AttributeNode, ElementNode, StarshipAttribute, StarshipToken } from './types'

const Parser = acorn.Parser.extend(jsx())
const code = `
<div "#container">
    <h1 ".text" style={color:red;}>Starship 🛰️</h1>
    <button {submit} on:click={() => setCounter(counter.value - 1)}> -1 </button>
    { counter }
    <img {https://science.nasa.gov/wp-content/uploads/2024/03/voyager-record-diagram.jpeg} "NASA Voyager" [50,50] />
    <a {../link}>Link here</a>
    <label {username}>Username:</label>
    <input {text} "#username" @"Placeholder text" />
</div>`

export class StarshipParser extends Parser {
    private length: number
    private tokens: StarshipToken[]
    private currentTokenIndex: number
    private ast: ASTNode

    constructor(options: acorn.Options, source: string) {
        super(options, source)
        this.input = this.input.trim() // trim whitespaces

        this.tokens = tokeniser(code) // DEBUG
        this.currentTokenIndex = 0
        this.length = this.tokens.length

        this.read()
    }
    
    read() {
        while (this.currentTokenIndex < this.length) {
          this.ast = this.parseElement()
          console.log(JSON.stringify(this.ast, null, 1))
        }
    }

    parseElement(): ASTNode {
      if (this.currentTokenIndex >= this.length) throw new Error("Unexpected end of input");
      const token = this.tokens[this.currentTokenIndex]

      if (token.type === 'text') {
        this.currentTokenIndex++
        return {
          type: 'Text',
          content: token.content
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
          attributes: attributes
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
          children: children
        }
      }
      
    }

    isClosingTagFor(token: StarshipToken): boolean {
      if (this.currentTokenIndex >= this.length) return false
      const currentToken = this.tokens[this.currentTokenIndex]
      return currentToken.type === token.type && currentToken.isClosing
    }
}