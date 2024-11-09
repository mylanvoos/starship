
import * as acorn from 'acorn'
import jsx from 'acorn-jsx'

const Parser = acorn.Parser.extend(jsx())

class StarshipParser extends Parser {
    private pos: number
    private length: number
    constructor(options: acorn.Options, source: string) {
        super(options, source)
        this.pos = 0
        this.input = this.input.trim() // trim whitespaces
        this.length = this.input.length
    }
    
    readToken(code: number) {
        const start = this.pos
        let end: number

        if (this.input[this.pos] + this.input[this.pos + 1] === '".') {
            console.log("class")
        }
        if (this.input[this.pos] + this.input[this.pos + 1] === '"#') {
            console.log("id")
        }
    }
    read() {
        while (this.pos < this.length) {
            this.readToken(this.pos)
            this.pos++
        }
    }
}

export function tokenise(source: string) {

    const parser = new StarshipParser({ ecmaVersion: "latest"}, source)
    console.log("Parser prototype")
    console.log(parser.read())
}