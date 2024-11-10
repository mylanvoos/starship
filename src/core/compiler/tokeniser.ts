import { capitaliseFirstLetter } from '../utils'
import { StarshipAttribute, StarshipToken } from './types'
import { 
    getAttributePatterns, 
    getExpression, 
    getGeneralPatterns, 
    splitAttributes 
} from './utils'

export class StarshipTokeniser {
    private source: string
    private tokens: StarshipToken[]

    constructor(source: string) {
        this.source = source
        this.tokens = []
        this.tokenise()
    }

    getTokens(): StarshipToken[] {
        return this.tokens
    }

    tokenise() {
        const { TEXT_TAGS } = getGeneralPatterns()
        let match
    
        /** 
         *  Matching tags will make match[1] defined 
         *  Matching text will make match[3] defined
         */
        while ((match = TEXT_TAGS.exec(this.source)) !== null) {
    
            if (match[1]) {
                const tagContent = match[0]
    
                const start = match.index
                const end = TEXT_TAGS.lastIndex
                const isSelfClosing = tagContent.includes("/>")
    
                const { tagType, isClosing, attributes }= this.processTag(tagContent)
    
                this.tokens.push({
                    type: tagType,
                    isClosing: isClosing,
                    isSelfClosing: isSelfClosing,
                    attributes: attributes,
                    content: tagContent,
                    start: start,
                    end: end
                })
            } else if (match[3]) {
    
                const textContent = match[3]
                const start = match.index
                const end = TEXT_TAGS.lastIndex
    
                if (textContent.trim() !== '') {
                    this.tokens.push({
                        type: 'text',
                        content: textContent,
                        start: start,
                        end: end
                    })
                }
            }
        }
    }

    processTag(input: string): {
        tagType: string,
        attributes: Set<StarshipAttribute>,
        isClosing: boolean
    } {
        const { TAGS } = getGeneralPatterns()
        let match: string[]
    
        /** 
         *  Matching opening tags will make match[1] defined 
         *  Matching closing text will make match[3] defined
         */
        while ((match = TAGS.exec(input)) !== null) {
            if (match[1]) {
                const tagName = match[1]
                let attributes = match[2]?.trim() || ""
                if (attributes.at(-1) === '/') {
                    attributes = attributes.substring(0, attributes.length - 1)
                }
                const attributeSet = splitAttributes(attributes) ? new Set<StarshipAttribute>(
                    splitAttributes(attributes)
                        .flatMap(attr => this.processAttribute(tagName, attr))) : null

                return {
                    tagType: tagName,
                    isClosing: false,
                    attributes: attributeSet
                }
            } else if (match[3]) {
                const closingTagName = match[3]
                return {
                    tagType: closingTagName,
                    attributes: null,
                    isClosing: true
                }
            }
        }
    }

    processAttribute(tag: string, attribute: string): StarshipAttribute[] {
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

        const attributeNameValue = (name: string, value: string): StarshipAttribute => ({ name, value })
        
        const handlers = {
            ".": () => attributeNameValue('className', INSIDE_CLASSID),
            "#": () => attributeNameValue('id', INSIDE_CLASSID),
            "placeholder": () => attributeNameValue('placeholder', INSIDE_CLASSID),
            "srcOrHref": () => attributeNameValue(tag === 'img' ? 'src' : 'href', INSIDE_BRACKETS),
            "type": () => attributeNameValue('type', INSIDE_BRACKETS),
            "for": () => attributeNameValue('for', INSIDE_BRACKETS),
            "event": () => attributeNameValue(`on${capitaliseFirstLetter(EVENT_NAME)}`, getExpression(attribute, `on:${EVENT_NAME}=`)),
            "alt": () => attributeNameValue('alt', INSIDE_BRACKETS),
            "imgSize": () => {
                const [width, height] = INSIDE_BRACKETS.split(',').map(dim => dim.trim());
                return [ attributeNameValue('width', width), attributeNameValue('height', height) ];
            },
            "default": () => attributeNameValue(ATTR_NAME, getExpression(attribute, `${ATTR_NAME}=`))

            // TODO: Add more shortcuts
        }
    
        if (attribute.startsWith("on:")) return [handlers["event"]()];
        if (IS_PLACEHOLDER) return [handlers["placeholder"]()];
        if (tag === 'img' && IN_SQUARE_BRACKETS) return handlers["imgSize"]();
        if (tag === 'img' && IN_QUOTES) return [handlers["alt"]()];
        if (IN_CURLY_BRACKETS && (tag === 'img' || tag === 'a')) return [handlers["srcOrHref"]()];
        if (IN_CURLY_BRACKETS && (tag === 'button' || tag === 'input')) return [handlers["type"]()];
        if (IN_CURLY_BRACKETS && tag === 'label') return [handlers["for"]()]
    
        // Symbol-based attributes for classes or IDs
        // attribute[1] === "." and attribute[1] === "#"
        const symbolHandler = handlers[attribute[1]]
        if (symbolHandler && IN_QUOTES) return [symbolHandler()]
    
        return [handlers["default"]()]
    }
}
