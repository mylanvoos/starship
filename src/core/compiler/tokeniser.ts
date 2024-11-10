import { StarshipAttribute, StarshipToken } from './types'
import { getAttributePatterns, getGeneralPatterns } from './utils'


export function tokeniser(input: string): StarshipToken[] {
    const result: StarshipToken[] = []

    const { TEXT_TAG } = getGeneralPatterns()

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
            })
        } else if (match[2]) {

            const textContent = match[2]
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
    const { OPENING_TAG, CLOSING_TAG } = getGeneralPatterns()

    let match

    if ((match = OPENING_TAG.exec(input)) !== null) {
        const tagName = match[1]
        let attributes = match[2]?.trim() || ""
        if (attributes.at(-1) === '/') {
            attributes = attributes.substring(0, attributes.length - 1)
        }
        const attributeSet = splitAttributes(tagName, attributes)
        console.log(attributeSet)

        return {
            tagType: tagName,
            isClosing: false,
            attributes: attributeSet
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
                const attributeList = createStarshipAttribute(tag, attr)
                for (let i = 0; i < attributeList.length; i++) {
                    attributes.add(attributeList[i])
                }
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
        const attributeList = createStarshipAttribute(tag, attr)
        for (let i = 0; i < attributeList.length; i++) {
            attributes.add(attributeList[i])
        }
    }
    return attributes
}

// TODO: Optimise and clean this up. Proper handling of width/height shortcuts in img instead of returning as Array

function createStarshipAttribute(tag: string, attribute: string): StarshipAttribute[] {

    const { 
        IS_PLACEHOLDER,
        IN_QUOTES, 
        IN_CURLY_BRACKETS, 
        INSIDE_BRACKETS, 
        IN_SQUARE_BRACKETS, 
        INSIDE_CLASSID, 
        EVENT_NAME,
        ATTR_NAME
    } = getAttributePatterns(attribute)

    console.log(tag, attribute)
    
    if (attribute.at(1) === "." && IN_QUOTES) {
        return [{
            type: 'class',
            value: INSIDE_CLASSID
        }]
    } 
    if (attribute.at(1) === "#" && IN_QUOTES) {
        return [{
            type: 'id',
            value: INSIDE_CLASSID
        }]
    } 
    if (IS_PLACEHOLDER) {
        return [{
            type: 'placeholder',
            value: INSIDE_CLASSID
        }]
    }
    if ((tag === 'img' || tag === 'a') && IN_CURLY_BRACKETS) {
        return [{
            type: 'path',
            name: tag === 'img' ? 'src' : 'href',
            value: INSIDE_BRACKETS
        }]
    } 
    if ((tag === 'button' || tag === 'input') && IN_CURLY_BRACKETS) {
        return [{
            type: 'type',
            value: INSIDE_BRACKETS
        }]
    } 
    if (tag === 'label' && IN_CURLY_BRACKETS) {
        return [{
            type: 'for',
            value: INSIDE_BRACKETS
        }]
    } 
    if (attribute.startsWith("on:")) {
        return [{
            type: 'event',
            name: EVENT_NAME,
            value: attribute.replace(`on:${EVENT_NAME}=`, '')
        }]
    }
    if (tag === 'img' && IN_QUOTES) {
        return [{
            type: 'alt',
            value: INSIDE_BRACKETS
        }]
    }
    console.log(IN_SQUARE_BRACKETS)
    if (tag === 'img' && IN_SQUARE_BRACKETS) {
        const dimensions = INSIDE_BRACKETS.split(',').map(dim => dim.trim())
        if (dimensions.length === 2) {
            const [width, height] = dimensions
            return [
                {
                    type: 'attribute',
                    name: 'width',
                    value: width
                },
                {
                    type: 'attribute',
                    name: 'height',
                    value: height
                }
            ]
        }
    }
    return [{
        type: 'attribute',
        name: ATTR_NAME,
        value: attribute
    }]
}
