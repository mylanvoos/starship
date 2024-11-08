import { Options, Parser, tokenizer } from "acorn";
import { TokeniserOptions } from "./options";
import { Stack } from "./utils";
import fs from 'fs'
import jsx, * as acornjsx from 'acorn-jsx'

class StarshipTokeniser extends Parser.extend(jsx({ allowNamespaces: false })) {
  specialTags: Set<string>
  specialTagsStack: Stack<string>

  constructor(options: Options, input: string) {
    super(options, input)
    this.specialTags = new Set(['Show', 'For', 'Switch'])
    this.specialTagsStack = new Stack<string>()
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