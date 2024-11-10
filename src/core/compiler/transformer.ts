import { ASTNode } from "./types";


export class StarshipTransformer {
    private ast: ASTNode[]
    
    constructor(ast: ASTNode[]) {
        this.ast = ast
    }

    transformToJSX(): string {
        return "" // placeholder
    }
}