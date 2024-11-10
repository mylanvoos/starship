const PATTERNS = {
    TEXT_TAGS: /<\/?(\w+)((?:[^"'>{}]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|{(?:\\.|[^}\\])*})*?)>|([^<>]+)/g, // Matches tags and text
    TAGS: /<(\w+)((?:[^"'>{}]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|{(?:\\.|[^}\\])*})*?)>|<\/(\w+)>/, // Matches opening and closing tags
    
    QUOTES: /^(['"])(.*)\1$/,                // Matches text wrapped in single or double quotes
    CURLY_BRACKETS: /^{(.*)}$/,              // Matches text wrapped in curly braces (special shortcuts)
    SQUARE_BRACKETS: /^\[(.*)]$/,            // Matches text wrapped in square brackets
    PLACEHOLDER: /^@(['"])(.*)\1$/,                       // Matches text starting with '@'
    EVENT_NAME: /on:([^=]+)=/,
    ATTR_NAME: /([^=]+)=/
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
    return {
        IN_QUOTES,
        IN_CURLY_BRACKETS,
        IN_SQUARE_BRACKETS,
        IS_PLACEHOLDER,
        INSIDE_BRACKETS,
        INSIDE_CLASSID,
        
        EVENT_NAME,
        ATTR_NAME
    };
}

export function getGeneralPatterns() {
    return {
        TEXT_TAGS: PATTERNS.TEXT_TAGS,
        TAGS: PATTERNS.TAGS
    }
}

export function capitaliseFirstLetter(str: string) {
    return str.at(0).toUpperCase() + str.substring(1)
}

export function getExpression(str: string) { 
    return str.substring(1, str.length - 1)
}