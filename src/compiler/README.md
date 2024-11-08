### Starship Compiler

Welcome to the compiler! Here we store the code for the parser, tokeniser, and transformer for Starship.

A parser's job is to take raw template code like:

```html
<div .container>
  <button on:click={count++}>
    Count is {count}
  </button>
</div>
```

and understand its structure and meaning.

#### Transform Pipeline:

Template String 
  → Tokens (lexer)
  → AST (parser) 
  → Transformed AST (.uss format)
  → Generated code (JSX/TSX)

#### Tokenisation
TAG tokens: `<div>`, `<button>`
ATTRIBUTE tokens: `".container"`, `on:click`
DIRECTIVE: `<if>`, `<for>`, `<Show>`
EXPRESSION: `{count++}`, `{count}`, anything in `{...}`
TEXT tokens: `"String"`

#### Parsing (Syntactic Analysis)
Builds an Abstract Syntax Tree (AST) from tokens, representing the hierarchical structure of the template.

Example AST node types:

```js
Element: {        // Represents HTML elements
    type: 'Element'
    tag: 'div'
    attributes: []
    children: []
}
  
Expression: {     // Dynamic JavaScript expressions
    type: 'Expression' 
    value: 'count++'
}
  
Text: {          // Static text content
    type: 'Text'
    value: 'Count is'
}
```