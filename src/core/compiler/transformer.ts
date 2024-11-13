import { capitaliseFirstLetter, decapitaliseFirstLetter } from "../utils"
import { ASTNode, StarshipAttribute } from "./types";
import { getAttributePatterns } from "./utils";


export class StarshipTransformer {
    private ast: ASTNode[]
    private jsx: string
    private depth: number
    private starshipTags: string[]

    constructor(ast: ASTNode[]) {
        this.ast = ast
        this.jsx = ""
        this.depth = 0
        this.starshipTags = ['Show', 'For'] // tags specific to Starship
    }

    toJSX(): string {
        this.jsx = this.transformNodes(this.ast)
        console.log(this.jsx)
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
            if (this.starshipTags.includes(node.tagName)) {
                return this.transformStarshipElements(node)
            }
            return this.transformJSXElements(node)
        }
        return ''
    }

    transformStarshipElements(node: ASTNode): string {
        const openingTag = `${"    ".repeat(this.depth)}<${node.tagName}${this.transformStarshipAttributes(node.tagName, node.attributes)}>`
        const closingTag = `</${node.tagName}>`

        this.depth++
        const childrenContent = this.transformStarshipChildren(node);
        this.depth--

        return `${openingTag}\n${childrenContent}${"    ".repeat(this.depth)}${closingTag}\n`
    }

    transformStarshipAttributes(tagName: string, attributes: StarshipAttribute[]): string {
        let str = ''
        // Enforce operator 1 === operator 2 for now
        if (tagName === 'Show') {
            const split = attributes[0].value.split(" ")
            const operator1 = split[0]
            const operand = split[1]
            if (operand !== '==' && operand !== '===') throw new Error('Invalid operand for <Show>!')
            const operator2 = split[2]
            str = ` when={() => ${operator1}.value ${operand} ${operator2}.value}`
        }
        if (tagName === 'For') {
            if (attributes.length !== 3) throw new Error('Invalid number of attributes for <For>!')
            for (const attr of attributes) {
                console.log(attr)
                if (attr.value === 'range') {
                    str += ` ${attr.name}={true}`
                } else if (attr.value === 'in') {
                    str += ` ${attr.name}={false}`
                } else {
                    str += ` ${attr.name}={${attr.value}}`
                }
            }
        }
        console.log(str)
        return str
    }

    transformStarshipChildren(node: ASTNode) {
        return ""
    }

    transformJSXElements(node: ASTNode): string {
        const openingTag = `${"    ".repeat(this.depth)}<${node.tagName}${this.transformJSXAttributes(node.attributes)}>`
        const closingTag = `</${node.tagName}>`

        this.depth++
        const childrenContent = this.transformNodes(node.children);
        this.depth--

        return `${openingTag}\n${childrenContent}${"    ".repeat(this.depth)}${closingTag}\n`
    }

    transformJSXAttributes(attributes: StarshipAttribute[]): string {
        let strArray: string[] = []

        for (const attr of attributes) {
            const { SETTER_BOOL, SETTER_VAL } = getAttributePatterns(attr.value)
            if (SETTER_VAL) {
                const variableName = decapitaliseFirstLetter(SETTER_VAL[1])
                const operator = SETTER_VAL[2]
                const operand = SETTER_VAL[3]
                if (operator === '') {
                    attr.value = `() => set${capitaliseFirstLetter(variableName)}(${operand}.value)`
                } else {
                    attr.value = `() => set${capitaliseFirstLetter(variableName)}(${variableName}.value ${operator} ${operand})`
                }
            } else if (SETTER_BOOL) {
                const variableName = decapitaliseFirstLetter(SETTER_BOOL[1])
                attr.value = `() => set${capitaliseFirstLetter(variableName)}(!${variableName}.value)`
            }
            strArray.push(attr.name.includes("on") ? ` ${attr.name}={${attr.value}}` : ` ${attr.name}="${attr.value}"`)
        }
        return strArray.join('')
    }
}
