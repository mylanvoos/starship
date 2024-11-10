import * as acorn from 'acorn'
import jsx from 'acorn-jsx'

import { tokeniser } from "./tokeniser"
import { StarshipToken } from './types'

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

    constructor(options: acorn.Options, source: string) {
        super(options, source)
        this.input = this.input.trim() // trim whitespaces
        this.length = this.input.length

        this.tokens = tokeniser(code) // DEBUG
        console.log(this.tokens)
    }
    
    readToken(code: number) {
        
    }
    read() {
        
    }
}