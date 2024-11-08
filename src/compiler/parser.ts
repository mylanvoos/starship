import { Options, Parser, tokenizer } from "acorn";
import { TokeniserOptions } from "./options";
import { Stack } from "./utils";
import fs from 'fs'
import jsx, * as acornjsx from 'acorn-jsx'
import { StarshipAttribute, StarshipToken } from "./types";

class StarshipTokeniser extends (Parser as any) {
  declare specialTags: Set<string>
  declare specialTagsStack: Stack<string>
  declare currentAttributes: Set<StarshipAttribute>

  constructor(options: Options, input: string) {
    const jsxParser = Parser.extend(jsx())
    super(options, input)

    this.specialTags = new Set(['Show', 'For', 'Switch'])
    this.specialTagsStack = new Stack<string>()
    this.currentAttributes = new Set<StarshipAttribute>()
  }

  readToken(code: number): StarshipToken {
    if (code === 60) { // '<'
      return this.readTag()
    }
    return super.readToken(code)
  }

}

export function parse(source: string) {
  const tokeniser = tokenizer(source, TokeniserOptions)
  // console.log(tokeniser.getToken())

  
  const code = `
  <div #root>
    <p .hello>Hello</p>
    <p .hello>World</p>
    <button on:click={console.log("Hi")}> Click me </button>
    <img {../public/img.png} size="50"/>
    <a {../hi.pdf} /> 
  </div>
  `;

}