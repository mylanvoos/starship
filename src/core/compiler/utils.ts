const PATTERNS = {
    TEXT_TAGS: /<(\w+)((?:[^"'>{}]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|{(?:\\.|[^}\\])*})*?)>|<\/(\w+)>/g, // Matches opening and closing tags
    OPENING_TAG: /<(\w+)((?:[^"'>{}]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|{(?:\\.|[^}\\])*})*?)>/,
    CLOSING_TAG: /<\/(\w+)>/,
    
    QUOTES: /^(['"])(.*)\1$/,                // Matches text wrapped in single or double quotes
    CURLY_BRACKETS: /^{(.*)}$/,              // Matches text wrapped in curly braces (special shortcuts)
    SQUARE_BRACKETS: /^\[(.*)]$/,            // Matches text wrapped in square brackets
    PLACEHOLDER: /^@/,                       // Matches text starting with '@'
    
}

export function getAttributePatterns(attribute: string) {
    const IN_QUOTES = PATTERNS.QUOTES.test(attribute);
    const IN_CURLY_BRACKETS = PATTERNS.CURLY_BRACKETS.test(attribute)
    const IN_SQUARE_BRACKETS = PATTERNS.SQUARE_BRACKETS.test(attribute)
    const IS_PLACEHOLDER = PATTERNS.PLACEHOLDER.test(attribute)

    const INSIDE_BRACKETS = attribute.replace(PATTERNS.QUOTES, '$2')
        .replace(PATTERNS.CURLY_BRACKETS, '$1')
        .replace(PATTERNS.SQUARE_BRACKETS, '$1')
    const INSIDE_CLASSID = IS_PLACEHOLDER ? attribute.substring(1) : null

    return {
        IN_QUOTES,
        IN_CURLY_BRACKETS,
        IN_SQUARE_BRACKETS,
        IS_PLACEHOLDER,
        INSIDE_BRACKETS,
        INSIDE_CLASSID
    };
}

export function getGeneralPatterns(attribute: string) {
    return {
        TEXT_TAG: PATTERNS.TEXT_TAGS,
        OPENING_TAG: PATTERNS.OPENING_TAG,
        CLOSING_TAG: PATTERNS.CLOSING_TAG
    }
}