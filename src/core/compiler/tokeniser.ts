
import { lookAheadFor } from '../utils'
import * as acorn from 'acorn'
import jsx from 'acorn-jsx'
import { StarshipAttribute, StarshipToken } from './types'


export function tokeniser(input: string): StarshipToken[] {
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
            const attributeSet = splitAttributes(tagName, attributes)
            console.log(attributeSet)

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

function splitAttributes(tag: string, attributesString: string): Set<StarshipAttribute> {
    const attributes: Set<StarshipAttribute> = new Set()
    let attr = ''
    let inDoubleQuotes = false
    let inSingleQuotes = false
    let braceDepth = 0

    for (let i = 0; i < attributesString.length; i++) {
        const char = attributesString[i]

        if (char === ' ' && !inDoubleQuotes && !inSingleQuotes && braceDepth === 0) {
            if (attr.length > 0) {
                const attribute = createStarshipAttribute(tag, attr)
                attributes.add(attribute)
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
        const attribute = createStarshipAttribute(tag, attr)
        attributes.add(attribute)
    }
    return attributes
}

function createStarshipAttribute(tag: string, attribute: string): StarshipAttribute {
    /** 
     * ".container" is shorthand for class="container"
     * "#id" is shorthand for id="id"
     */
    const QUOTES = ["'", '"']
    const IN_QUOTES = QUOTES.includes(attribute.at(0)) && QUOTES.includes(attribute.at(-1))
    const IN_CURLY_BRACKETS = attribute.at(0) === '{' && attribute.at(-1) === '}'
    const IN_SQUARE_BRACKETS = attribute.at(0) === '[' && attribute.at(-1) === ']'
    const IS_PLACEHOLDER = attribute.at(0) === '@'

    const INSIDE_BRACKETS = attribute.substring(1, attribute.length - 1)

    console.log(tag, attribute)
    if (attribute.at(1) === "." && IN_QUOTES) {
        return {
            type: 'class',
            value: attribute.substring(2, attribute.length - 1)
        }
    } else if (attribute.at(1) === "#" && IN_QUOTES) {
        return {
            type: 'id',
            value: attribute.substring(2, attribute.length - 1)
        }
    } else if (tag === 'img' && IN_CURLY_BRACKETS) {
        return {
            type: 'path',
            name: 'src',
            value: INSIDE_BRACKETS
        }
    } else if (tag === 'button' && IN_CURLY_BRACKETS) {
        return {
            type: 'type',
            name: 'type',
            value: INSIDE_BRACKETS
        }
    } else {
        return {
            type: 'attribute',
            value: attribute
        }
    }
}