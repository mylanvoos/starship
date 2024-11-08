import { Token } from "./types"
import SuperExpressive from "super-expressive"

/*
 * Instead of an Array implementation of the stack, we use a 
 * singly linked list (one-way linked list) so we can have O(1)
 * complexity for adding and popping elements at the head or tail.
*/
export class Node<T> {
    data: T
    next: Node<T> | null
    constructor(data: T) {
        this.data = data
        this.next = null
    }
    toString(): string {
        return this.data.toString()
    }
}
export class Stack<T> {
    top: Node<T>
    size: number
    constructor() {
        this.top = null
        this.size = 0
    }
    push(value: T) {
        const node = new Node(value)
        node.next = this.top
        this.top = node
        this.size++
    }
    pop(): T {
        const data = this.size === 0 ? null : this.top.data
        this.top = this.top.next
        this.size--
        return data
    }
    clone(): Stack<T> {
        const newStack = new Stack<T>()
        let current = this.top
        const tempArray: T[] = [...Array(this.size)] // fixed size for optimality

        while (current) {
            tempArray.push(current.data)
            current = current.next
        }
        for (let i = tempArray.length - 1; i >= 0; i--) {
            newStack.push(tempArray[i])
        }
          
        return newStack
    }
    toString(): string {
        if (this.size === 0) {
            return "[]"
        }

        let result = "["
        let current = this.top
        
        while (current) {
            // @ts-ignore
            if ('type' in current.data && 'value' in current.data) {
                // Handle Token type specifically
                const token = current.data as Token
                result += `\n  {`
                result += `\n    type: "${token.type}",`
                result += `\n    value: "${token.value}"`
                
                if (token.content !== undefined) {
                    result += `,\n    content: "${token.content}"`
                }
                
                if (token.selfClosing !== undefined) {
                    result += `,\n    selfClosing: ${token.selfClosing}`
                }
                result += '\n  }'

            } else {
                // Generic fallback for other types
                result += JSON.stringify(current.data)
            }
            if (current.next) {
                result += ","
            }
            current = current.next
        }
        return result + "\n]"
    }
    
}

export function tokenise(source: string): Stack<Token> {
    // Pattern matching for tags, attributes, etc.

    let tokens: Stack<Token> = new Stack()

    // const elementPattern = /<(?<tag>[a-zA-Z][a-zA-Z0-9]*)(?<attrs>[^>]*?)(?:>(?<content>(?:(?!<\/?\1[\s>]).)*)<\/\1>|(?<selfClosing>\/?)>)/g;
    const tagPattern = /<\/?([a-zA-Z]+)([^>]*?)\/?>/g
    const attributePattern = /(\.[a-zA-Z0-9_-]+|#[a-zA-Z0-9_-]+)|([a-zA-Z0-9_-]+)="([^"]*)"|([a-zA-Z0-9_-]+:[a-zA-Z0-9_-]+)={([^}]*)}/g
    const directivePattern = SuperExpressive().startOfInput
                        .capture
                            .string('on:')
                            .oneOrMore.word
                            .string('={')
                            .zeroOrMoreLazy.anyChar
                            .char('}')
                        .end().endOfInput.toRegex()
    const classPattern = SuperExpressive().startOfInput.string('.')
                        .capture
                            .word
                            .zeroOrMore
                            .anyOf
                                .word
                                .char('-')
                            .end()
                        .end().endOfInput.toRegex()
    const idPattern = SuperExpressive().startOfInput.string('#')
                        .capture
                            .word
                            .zeroOrMore
                            .anyOf
                                .word
                                .char('-')
                            .end()
                        .end().endOfInput.toRegex()

    const tags = source.match(tagPattern)
    tags.forEach((tag) => {
        console.log("Tag:", tag)
        if (tag.includes('<') && !tag.includes('</')) {
            const split = tag.extractBetween("<", ">").split(" ")
            tokens.push({
                type: 'TagOpen',
                value: split[0],
                content: split.slice(1).toString()
            })
        }
        if (tag.includes('</')) {
            tokens.push({
                type: 'TagClose',
                value: tag.extractBetween("</", ">")
            })
        } 

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

    return tokens
}
