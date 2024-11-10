import { capitaliseFirstLetter } from "../utils"
import { ASTNode, StarshipAttribute } from "./types";
import { getAttributePatterns } from "./utils";


export class StarshipTransformer {
    private ast: ASTNode[]
    private jsx: string
    private depth: number
    
    constructor(ast: ASTNode[]) {
        this.ast = ast
        this.jsx = ""
        this.depth = 0
    }

    toJSX(): string {
        this.jsx = this.transformNodes(this.ast)
        return this.jsx
    }

    transformNodes(nodes: ASTNode[]): string {
        if (nodes.length === 0) {
            return ''
        }
        let result = ''
        for (const node of nodes) {
            result += this.transformNode(node)
        }
        return result
    }

    transformNode(node: ASTNode): string {
        if (node.type === 'Text') {
            return `${"    ".repeat(this.depth)}${node.content}\n`
        }

        if (node.type === 'Element' && node.tagName) {
            const openingTag = `${"    ".repeat(this.depth)}<${node.tagName}${this.transformAttributes(node.attributes)}>`
            const closingTag = `</${node.tagName}>`
            
            this.depth++
            const childrenContent = this.transformNodes(node.children);
            this.depth--

            return `${openingTag}\n${childrenContent}${"    ".repeat(this.depth)}${closingTag}\n`
        }
        return ''
    }

    transformAttributes(attributes: StarshipAttribute[]): string {
        let strArray: string[] = []

        for (const attr of attributes) {
            const { SETTER_BOOL, SETTER_INT } = getAttributePatterns(attr.value)
            if (SETTER_INT) {
                const variableName = SETTER_INT[1].toLowerCase()
                const operator = SETTER_INT[2]
                const operand = SETTER_INT[3]
                attr.value = `() => set${capitaliseFirstLetter(variableName)}(${variableName}.value ${operator} ${operand})`
            } else if (SETTER_BOOL) {
                const variableName = SETTER_BOOL[1].toLowerCase()
                attr.value = `() => set${capitaliseFirstLetter(variableName)}(!${variableName}.value)`
            } 
            strArray.push(attr.name.includes("on") ? ` ${attr.name}={${attr.value}}` : ` ${attr.name}="${attr.value}"`)
        }
        return strArray.join('')
    }
}
