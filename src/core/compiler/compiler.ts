import { StarshipParser } from "./parser";
import { StarshipTokeniser } from "./tokeniser";
import { StarshipTransformer } from "./transformer";


/** Compiles Starship syntax to JSX */
export function compile(source: string): string {
    const tokeniser = new StarshipTokeniser(source)
    const parser = new StarshipParser({ 
        ecmaVersion: "latest", 
        tokeniser
    }, source)
    const ast = parser.getAST()
    const transformer = new StarshipTransformer(ast)
    return transformer.transformToJSX()
}