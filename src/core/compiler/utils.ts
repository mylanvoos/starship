const PATTERNS = {
    TEXT_TAGS: /(<[^>]+>)|([^<]+)/g, // Matches opening and closing tags
    OPENING_TAG: /<(\w+)((?:[^"'>{}]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|{(?:\\.|[^}\\])*})*?)>/,
    CLOSING_TAG: /<\/(\w+)>/,
    
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
        TEXT_TAG: PATTERNS.TEXT_TAGS,
        OPENING_TAG: PATTERNS.OPENING_TAG,
        CLOSING_TAG: PATTERNS.CLOSING_TAG
    }
}