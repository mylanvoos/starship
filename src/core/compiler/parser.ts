import * as acorn from 'acorn'
import jsx from 'acorn-jsx'

import { tokeniser } from "./tokeniser"
import { ElementNode, StarshipToken } from './types'

const Parser = acorn.Parser.extend(jsx())
const code = `
<div "#container">
    <h1 ".text" style={color:red;}>Starship 🛰️</h1>
    <button {submit} on:click={() => setCounter(counter.value - 1)}> -1 </button>
    { counter }
    <img {https://science.nasa.gov/wp-content/uploads/2024/03/voyager-record-diagram.jpeg} "NASA Voyager" [50,50]/>
    <a {../link}>Link here</a>
    <label {username}>Username:</label>
    <input {text} "#username" @"Placeholder text">
</div>`

export class StarshipParser extends Parser {
    private length: number
    private tokens: StarshipToken[]
    private currentTokenIndex: number

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
          this.parseElement()
          this.currentTokenIndex++
        }
    }

    parseElement() {
      const token = this.tokens[this.currentTokenIndex]
      console.log(token)
      
      const tagName = token.type
      
      
    }
}