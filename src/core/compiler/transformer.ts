import { ASTNode, StarshipAttribute } from "./types";


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
            const openingTag = `${"    ".repeat(this.depth)}<${node.tagName}${this.transformAttributes(node.attributes)}>`
            const closingTag = `</${node.tagName}>`
            
            this.depth++
            const childrenContent = this.transformNodes(node.children);
            this.depth--

            return `${openingTag}\n${childrenContent}${"    ".repeat(this.depth)}${closingTag}\n`
        }
        return ''
    }

    transformAttributes(attributes: StarshipAttribute[], event?: boolean): string {
        
        return attributes
            .map(attr => ` ${attr.name}="${attr.value}"`)
            .join('')
    }
}
