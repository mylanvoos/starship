import * as acorn from 'acorn'
import jsx from 'acorn-jsx'

import { tokeniser } from "./tokeniser"

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
    private pos: number
    private length: number
    private tags: string[]

    constructor(options: acorn.Options, source: string) {
        super(options, source)
        this.pos = 0
        this.input = this.input.trim() // trim whitespaces
        this.length = this.input.length
        
        console.log(tokeniser(code)) // DEBUG
    }
    
    readToken(code: number) {
        
    }
    read() {
        
    }
}