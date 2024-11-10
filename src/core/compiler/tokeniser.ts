import { StarshipAttribute, StarshipToken } from './types'
import { getAttributePatterns, getGeneralPatterns } from './utils'


export function tokeniser(input: string): StarshipToken[] {
    const result: StarshipToken[] = []

    const { TEXT_TAG } = getGeneralPatterns(input)

    let match

    /** 
     *  Matching tags will make match[1] defined 
     *  Matching text will make match[3] defined
     */
    while ((match = TEXT_TAG.exec(input)) !== null) {

        if (match[1]) {
            const tagContent = match[0]

            const start = match.index
            const end = TEXT_TAG.lastIndex
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

            const start = match.index
            const end = TEXT_TAG.lastIndex

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
    const { OPENING_TAG, CLOSING_TAG } = getGeneralPatterns(input)

    let match

    if ((match = OPENING_TAG.exec(input)) !== null) {
        const tagName = match[1]
        const attributes = match[2]?.trim() || ""
        const attributeSet = splitAttributes(tagName, attributes)
        console.log(attributeSet)

        return {
            tagType: tagName,
            isClosing: false,
            attributes: attributes
        }
    } else if ((match = CLOSING_TAG.exec(input)) !== null) {
        const closingTagName = match[3];
        return {
            tagType: closingTagName,
            attributes: null,
            isClosing: true
        }
    }
    return null
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
                attributes.add(createStarshipAttribute(tag, attr))
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
        attributes.add(createStarshipAttribute(tag, attr))
    }
    return attributes
}

function createStarshipAttribute(tag: string, attribute: string): StarshipAttribute {
    /** 
     * ".container" is shorthand for class="container"
     * "#id" is shorthand for id="id"
     * and so on
     */

    const { IN_QUOTES, IN_CURLY_BRACKETS, INSIDE_BRACKETS } = getAttributePatterns(attribute)
    

    console.log(tag, attribute)
    if (attribute.at(1) === "." && IN_QUOTES) {
        return {
            type: 'class',
            value: attribute.substring(2, attribute.length - 1)
        }
    } 
    if (attribute.at(1) === "#" && IN_QUOTES) {
        return {
            type: 'id',
            value: attribute.substring(2, attribute.length - 1)
        }
    } 
    if ((tag === 'img' || tag === 'a') && IN_CURLY_BRACKETS) {
        return {
            type: 'path',
            name: tag === 'img' ? 'src' : 'href',
            value: INSIDE_BRACKETS
        }
    } 
    if ((tag === 'button' || tag === 'input') && IN_CURLY_BRACKETS) {
        return {
            type: 'type',
            value: INSIDE_BRACKETS
        }
    } 
    if (tag === 'label' && IN_CURLY_BRACKETS) {
        return {
            type: 'for',
            value: INSIDE_BRACKETS
        }
    } 
    return {
        type: 'attribute',
        value: attribute
    }
}