
import { lookAheadFor } from '../utils'
import * as acorn from 'acorn'
import jsx from 'acorn-jsx'
import { StarshipAttribute, StarshipToken } from './types'

const Parser = acorn.Parser.extend(jsx())
const code = `
<div ".container">
    <h1 "#text" style={color:red;}>Starship 🛰️</h1>
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

    const REGEX = /<\/?(\w+)((?:[^"'>{}]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|{(?:\\.|[^}\\])*})*?)>|([^<>]+)/g
    let match

    /** 
     *  Matching tags will make match[1] defined 
     *  Matching text will make match[3] defined
     */
    while ((match = REGEX.exec(input)) !== null) {

        if (match[1]) {
            const tagContent = match[0]

            // console.log("Tag:", tagContent)

            const start = match.index
            const end = REGEX.lastIndex
            const isSelfClosing = tagContent.includes("/>")

            const { tagType, isClosing, attributes }= parseTag(tagContent)

            result.push({
                type: tagType,
                isClosing: isClosing,
                isSelfClosing: isSelfClosing,
                attributes: attributes,
                content: tagContent,
                start: start,
                end: end
            });
        } else if (match[3]) {

            const textContent = match[3]
            // console.log("Text:", textContent)

            const start = match.index
            const end = REGEX.lastIndex

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

function parseTag(input: string): {
    tagType: string,
    attributes: Set<StarshipAttribute>,
    isClosing: boolean
} {
    const MATCH_TAGS = /<(\w+)((?:[^"'>{}]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|{(?:\\.|[^}\\])*})*?)>|<\/(\w+)>/g
    const MATCH_ATTRIBUTES = /(\.[\w-]+)|([\w-]+)(?:=(\{[^}]*\}|"[^"]*"|'[^']*'))?/g

    let match

    /** 
     *  Matching opening tags will make match[1] defined 
     *  Matching closing tags will make match[3] defined
     */
    while ((match = MATCH_TAGS.exec(input)) !== null) {
        if (match[1]) {
            const tagName = match[1]
            const attributes = match[2]?.trim() || ""
            const attributeSet = splitAttributes(attributes)
            // console.log(attributeSet)

            return {
                tagType: tagName,
                isClosing: false,
                attributes: attributes
            }
        } else if (match[3]) {
            const closingTagName = match[3];
            return {
                tagType: closingTagName,
                attributes: null,
                isClosing: true
            }
        }
    }

    return null;
}

function splitAttributes(attributesString: string): Set<StarshipAttribute> {
    const attributes: string[] = []
    const attributeSet: Set<StarshipAttribute> = new Set()
    let attr = ''
    let inDoubleQuotes = false
    let inSingleQuotes = false
    let braceDepth = 0

    for (let i = 0; i < attributesString.length; i++) {
        const char = attributesString[i]

        if (char === ' ' && !inDoubleQuotes && !inSingleQuotes && braceDepth === 0) {
            if (attr.length > 0) {
                console.log("Attributes:", attr)
                attributes.push(attr)
                attr = ''
            }
            continue
        }

        attr += char

        if (char === '"' && !inSingleQuotes && braceDepth === 0) {
            inDoubleQuotes = !inDoubleQuotes
        } else if (char === "'" && !inDoubleQuotes && braceDepth === 0) {
            inSingleQuotes = !inSingleQuotes
        } else if (char === '{' && !inDoubleQuotes && !inSingleQuotes) {
            braceDepth++
        } else if (char === '}' && !inDoubleQuotes && !inSingleQuotes && braceDepth > 0) {
            braceDepth--
        }
    }
    if (attr.length > 0) {
        console.log("Attribute:", attr)
        attributes.push(attr)
    }
    return attributes
}