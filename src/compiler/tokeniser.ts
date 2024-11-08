import { Token } from "./types"
import { effect, when, _, match } from "../core/framework/framework"

export function tokenise(source: string): Token[] {
    // Pattern matching for tags, attributes, etc.

    let tokens: Token[] = []

    const tagPattern = /<\/?([a-zA-Z]+)([^>]*?)\/?>/g
    const attributePattern = /(\.[a-zA-Z0-9_-]+|#[a-zA-Z0-9_-]+)|([a-zA-Z0-9_-]+)="([^"]*)"|([a-zA-Z0-9_-]+:[a-zA-Z0-9_-]+)={([^}]*)}/g
    const directivePattern = /^on:([a-zA-Z]+)={([^}]*)}/
    const classPattern = /^\.(\w[\w-]*)$/
    const idPattern = /^#(\w[\w-]*)$/

    const tags = source.match(tagPattern)
    tags.forEach((tag) => {
        const attributes = tag.match(attributePattern)

        if (attributes) {
            attributes.forEach((attribute) => {
                let match: string[]
                if ((match = attribute.match(classPattern))) {
                    tokens.push({
                        type: 'Attribute',
                        value: 'class',
                        content: match[1],
                    } as Token)
                } else if ((match = attribute.match(idPattern))) {
                    tokens.push({
                        type: 'Attribute',
                        value: 'id',
                        content: match[1],
                    } as Token)
                } else if ((match = attribute.match(directivePattern))) {
                    tokens.push({
                        type: 'Directive',
                        value: match[1], // 'click' in on:click
                        content: match[2], // handler function
                    } as Token)
                } else if ((match = attribute.match(attributePattern))) {
                    tokens.push({
                        type: 'Attribute',
                        value: 'standard',
                        content: attribute,
                    } as Token)
                } else {
                    throw new Error(`Unknown attribute format: ${attribute}`)
                }
            })
            
        }
    })

    console.log(tokens)

    return tokens
}