import { Options, Parser, tokenizer } from "acorn";
import jsx, * as acornjsx from 'acorn-jsx'
import { StarshipAttribute, StarshipToken } from "./types";
import { tokenise } from "./tokeniser";

class StarshipTokenizer extends (Parser as any) {
  // Parser state
  declare specialTags: Set<string>;
  declare specialTagsStack: Array<{ name: string; start: number }>;
  declare currentAttributes: StarshipAttribute[];
  
  constructor(options: Options, input: string) {
    // Enable JSX parsing
    const jsxParser = Parser.extend(jsx());
    super(options, input);
    
    // Initialize parser state
    this.specialTags = new Set(['Show', 'If', 'Each']);
    this.specialTagsStack = [];
    this.currentAttributes = [];
  }

  readToken(code: number): StarshipToken {
    // Handle opening angle bracket
    if (code === 60) { // '<'
      return this.readTag();
    }
    
    return super.readToken(code);
  }

  readTag(): StarshipToken {
    const start = this.pos;
    this.pos++; // Skip '<'
    
    // Check for closing tag
    const isClosing = this.input.charCodeAt(this.pos) === 47; // '/'
    if (isClosing) this.pos++;
    
    // Read tag name
    const tagNameStart = this.pos;
    while (this.pos < this.input.length) {
      const ch = this.input.charCodeAt(this.pos);
      if (!/[a-zA-Z0-9]/.test(String.fromCharCode(ch))) break;
      this.pos++;
    }
    
    const tagName = this.input.slice(tagNameStart, this.pos);
    
    // Handle special tags
    if (this.specialTags.has(tagName)) {
      if (!isClosing) {
        this.specialTagsStack.push({
          name: tagName,
          start: start,
        });
      } else {
        const matchingTag = this.specialTagsStack.pop();
        if (matchingTag && matchingTag.name === tagName) {
          return this.finishToken('specialTag', {
            name: tagName,
            start: matchingTag.start,
            end: this.pos,
            content: this.input.slice(matchingTag.start, this.pos)
          });
        }
      }
    }
    
    // Process attributes
    this.processAttributes();
    
    return this.finishToken('tag', {
      name: tagName,
      isClosing,
      attributes: this.currentAttributes
    });
  }

  processAttributes(): void {
    this.currentAttributes = [];
    
    while (this.pos < this.input.length) {
      this.skipSpace();
      
      if (this.input.charCodeAt(this.pos) === 62) { // '>'
        this.pos++;
        break;
      }
      
      // Handle shorthand class
      if (this.input.charCodeAt(this.pos) === 46) { // '.'
        this.pos++;
        const classNameStart = this.pos;
        while (this.pos < this.input.length && /[a-zA-Z0-9-_]/.test(this.input[this.pos])) {
          this.pos++;
        }
        this.currentAttributes.push({
          type: 'class',
          value: this.input.slice(classNameStart, this.pos)
        });
        continue;
      }
      
      // Handle shorthand ID
      if (this.input.charCodeAt(this.pos) === 35) { // '#'
        this.pos++;
        const idStart = this.pos;
        while (this.pos < this.input.length && /[a-zA-Z0-9-_]/.test(this.input[this.pos])) {
          this.pos++;
        }
        this.currentAttributes.push({
          type: 'id',
          value: this.input.slice(idStart, this.pos)
        });
        continue;
      }
      
      // Handle directives (on:click, etc)
      if (this.input.slice(this.pos, this.pos + 8) === 'on:click') {
        this.pos += 8;
        this.skipSpace();
        if (this.input.charCodeAt(this.pos) === 61) { // '='
          this.pos++;
          this.currentAttributes.push({
            type: 'event',
            name: 'click',
            value: this.readJSExpression()
          });
        }
        continue;
      }
      
      // Handle src/href shorthand
      if (this.input.charCodeAt(this.pos) === 123) { // '{'
        this.pos++;
        const pathStart = this.pos;
        while (this.pos < this.input.length && this.input.charCodeAt(this.pos) !== 125) {
          this.pos++;
        }
        const path = this.input.slice(pathStart, this.pos);
        this.pos++; // Skip '}'
        
        this.currentAttributes.push({
          type: 'path',
          value: path
        });
        continue;
      }
      
      // Handle regular attributes
      const attrNameStart = this.pos;
      while (this.pos < this.input.length && /[a-zA-Z0-9-_:]/.test(this.input[this.pos])) {
        this.pos++;
      }
      
      const attrName = this.input.slice(attrNameStart, this.pos);
      if (!attrName) break;
      
      this.skipSpace();
      
      if (this.input.charCodeAt(this.pos) === 61) { // '='
        this.pos++;
        this.currentAttributes.push({
          type: 'attribute',
          name: attrName,
          value: this.readAttributeValue()
        });
      } else {
        this.currentAttributes.push({
          type: 'attribute',
          name: attrName,
          value: true
        });
      }
    }
  }

  readAttributeValue(): string | null {
    this.skipSpace();
    const quote = this.input.charCodeAt(this.pos);
    
    if (quote === 34 || quote === 39) { // '"' or "'"
      this.pos++;
      const valueStart = this.pos;
      while (this.pos < this.input.length && this.input.charCodeAt(this.pos) !== quote) {
        this.pos++;
      }
      const value = this.input.slice(valueStart, this.pos);
      this.pos++; // Skip closing quote
      return value;
    }
    
    // Handle JS expression in curly braces
    if (this.input.charCodeAt(this.pos) === 123) { // '{'
      return this.readJSExpression();
    }
    
    return null;
  }

  readJSExpression(): string {
    this.pos++; // Skip '{'
    let braceCount = 1;
    const expressionStart = this.pos;
    
    while (this.pos < this.input.length && braceCount > 0) {
      const ch = this.input.charCodeAt(this.pos);
      if (ch === 123) braceCount++; // '{'
      if (ch === 125) braceCount--; // '}'
      this.pos++;
    }
    
    return this.input.slice(expressionStart, this.pos - 1);
  }

  skipSpace(): void {
    while (this.pos < this.input.length && /\s/.test(this.input[this.pos])) {
      this.pos++;
    }
  }

  finishToken(type: string, value?: any): StarshipToken {
    return {
      type: type as any,
      value,
      start: this.start,
      end: this.pos
    };
  }
}

export function parse(source: string) {
  tokenise(source)

}