const PATTERNS = {
    TEXT_TAGS: /<\/?(\w+)((?:[^"'>{}]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|{(?:\\.|[^}\\])*})*?)>|([^<>]+)/g, // Matches tags and text
    TAGS: /<(\w+)((?:[^"'>{}]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|{(?:\\.|[^}\\])*})*?)>|<\/(\w+)>/, // Matches opening and closing tags
    
    QUOTES: /^(['"])(.*)\1$/,                // Matches text wrapped in single or double quotes
    CURLY_BRACKETS: /^{(.*)}$/,              // Matches text wrapped in curly braces (special shortcuts)
    SQUARE_BRACKETS: /^\[(.*)]$/,            // Matches text wrapped in square brackets
    PLACEHOLDER: /^@(['"])(.*)\1$/,                       // Matches text starting with '@'
    EVENT_NAME: /on:([^=]+)=/,
    ATTR_NAME: /([^=]+)=/,
    SETTER_VAL: /set([A-Z][a-zA-Z0-9]*)\(([-+]|''|""|)(\d+|\w+|\([^()]*\))\)/, // Matches setter shortcuts
    SETTER_BOOL: /set([A-Z][a-zA-Z0-9]*)\(!\)/
}

export function getAttributePatterns(attribute: string) {
    const IN_QUOTES = PATTERNS.QUOTES.test(attribute);
    const IN_CURLY_BRACKETS = PATTERNS.CURLY_BRACKETS.test(attribute)
    const IN_SQUARE_BRACKETS = PATTERNS.SQUARE_BRACKETS.test(attribute)
    const IS_PLACEHOLDER = PATTERNS.PLACEHOLDER.test(attribute)

    const INSIDE_BRACKETS = attribute.substring(1, attribute.length - 1)
    const INSIDE_CLASSID = attribute.substring(2, attribute.length - 1)

    const EVENT_NAME = attribute.match(PATTERNS.EVENT_NAME) ? attribute.match(PATTERNS.EVENT_NAME)[1].trim() : null
    const ATTR_NAME = attribute.match(PATTERNS.ATTR_NAME) ? attribute.match(PATTERNS.ATTR_NAME)[1].trim() : null
    const SETTER_VAL = attribute.match(PATTERNS.SETTER_VAL) 
    const SETTER_BOOL = attribute.match(PATTERNS.SETTER_BOOL) 
    return {
        IN_QUOTES,
        IN_CURLY_BRACKETS,
        IN_SQUARE_BRACKETS,
        IS_PLACEHOLDER,
        INSIDE_BRACKETS,
        INSIDE_CLASSID,
        
        EVENT_NAME,
        ATTR_NAME,
        SETTER_BOOL,
        SETTER_VAL
    };
}

export function getGeneralPatterns() {
    return {
        TEXT_TAGS: PATTERNS.TEXT_TAGS,
        TAGS: PATTERNS.TAGS,
    }
}

export function getExpression(input: string, header: string) { 
    const str = input.replace(header, '')
    return str.substring(1, str.length - 1)
}

export function splitAttributes(attributesString: string): string[] {
    const attributes: string[] = []
    let attr = ''
    let inDoubleQuotes = false
    let inSingleQuotes = false
    let braceDepth = 0

    for (let i = 0; i < attributesString.length; i++) {
        const char = attributesString[i]

        if (char === ' ' && !inDoubleQuotes && !inSingleQuotes && braceDepth === 0) {
            if (attr.length > 0) {
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
        attributes.push(attr)
    }
    return attributes.length > 0 ? attributes : null
}
