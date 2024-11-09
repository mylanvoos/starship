
import { lookAheadFor } from '../utils'
import * as acorn from 'acorn'
import jsx from 'acorn-jsx'
import { StarshipToken } from './types'

const Parser = acorn.Parser.extend(jsx())
const code = `
<div ".container">
    <h1 "#text">Starship 🛰️</h1>
    <p "#text">The classic button experiment to test reactivity...</p>
    <button on:click={() => setCounter(counter.value - 1)}> -1 </button>
        { counter }
    <button on:click={() => setCounter(counter.value + 1)}> +1 </button>
    <p "#text">{ message }</p>
    <img {https://science.nasa.gov/wp-content/uploads/2024/03/voyager-record-diagram.jpeg} />
    <a {../link}>Link here</a>
</div>`

class StarshipParser extends Parser {
    private pos: number
    private length: number
    private tags: string[]

    constructor(options: acorn.Options, source: string) {
        super(options, source)
        this.pos = 0
        this.input = this.input.trim() // trim whitespaces
        this.length = this.input.length
        console.log(tokeniser(this.input))
    }
    
    readToken(code: number) {
        const start = this.pos
        let end: number

        if (lookAheadFor(this.input, this.pos, '".')) {
            // console.log("class")
        } else if (lookAheadFor(this.input, this.pos, '"#')) {
            // console.log("id")
        }
    }
    read() {
        
    }
}

export function tokenise(source: string) {

    const parser = new StarshipParser({ ecmaVersion: "latest"}, code)
    console.log("Parser prototype")
    parser.read()
}

function tokeniser(input: string): StarshipToken[] {
    const result: StarshipToken[] = []

    const regex = /<\/?(\w+)((?:[^"'>{}]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|{(?:\\.|[^}\\])*})*?)>|([^<>]+)/g
    let match

    /** 
     *  Matching tags will make match[1] defined 
     *  Matching text will make match[3] defined
     */
    while ((match = regex.exec(input)) !== null) {

        if (match[1]) {
            const tagContent = match[0]

            console.log("Tag:", tagContent)

            const start = match.index
            const end = regex.lastIndex

            result.push({
                type: 'tag',
                content: tagContent,
                start: start,
                end: end
            });
        } else if (match[3]) {

            const textContent = match[3]
            console.log("Text:", textContent)
            
            const start = match.index
            const end = regex.lastIndex

            if (textContent.trim() !== '') {
                result.push({
                    type: 'text',
                    content: textContent,
                    start: start,
                    end: end
                })
            }
        }
    }

    return result
}

