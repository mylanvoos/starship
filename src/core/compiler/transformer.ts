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
        
        return "" // placeholder
    }
    transformNodes(nodes: ASTNode[]) {
        if (nodes.length === 0) {
            return ''
        }
        let result = ''
        for (const node of nodes) {
            result += this.transformNode(node)
        }
        return result
    }

    transformNode(node: ASTNode) {
        if (node.type === 'Text') {
            return node.content  
        }
    
        if (node.tagName) {
            return `<${node.tagName}${this.transformAttributes(node.attributes)}>\n\t${this.transformNodes(node.children)}</${node.tagName}>\n`
        }
        return ''
    }
    transformAttributes(attributes: StarshipAttribute[]) {
        let str = ""
        const addToString = (name: string, value: string) => {str += ` ${name}="${value}"` }
        attributes.flatMap(e => addToString(e.name, e.value))
        return str
    }
}