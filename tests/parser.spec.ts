import { test, expect } from '@playwright/test'
import { tokeniser } from '../src/core/compiler/tokeniser'
import { StarshipParser } from '../src/core/compiler/parser'
import { ASTNode } from '../src/core/compiler/types'

const code = `
<div "#container">
    <h1 ".text" style={color:red;}>Starship 🛰️</h1>
    <button {submit} on:click={() => setCounter(counter.value - 1)}> -1 </button>
    { counter }
    <img {https://science.nasa.gov/wp-content/uploads/2024/03/voyager-record-diagram.jpeg} "NASA Voyager" [50,50]/>
    <a {../link}>Link here</a>
    <label {username}>Username:</label>
    <input {text} "#username" @"Placeholder text" />
</div>`

const parse = (input: string): ASTNode[] => {
    const parser = new StarshipParser({ ecmaVersion: "latest" }, input)
    return parser.getAST()
}

test('Parses a single element without children', () => {
    const input = `<div></div>`
    const ast = parse(input)

    expect(ast).toStrictEqual([
        {
            type: 'Element',
            tagName: 'div',
            attributes: [],
            children: [],
            content: '<div>'
        }
    ])
})

test('Parses an element with text content', () => {
    const input = `<div>Hello, World!</div>`
    const ast = parse(input)

    expect(ast).toStrictEqual([
        {
            type: 'Element',
            content: '<div>',
            tagName: 'div',
            attributes: [],
            children: [
                {
                    type: 'Text',
                    content: 'Hello, World!',
                    attributes: [],
                    children: [],
                    tagName: null
                }
            ]
        }
    ])
})

test('Parses nested elements', () => {
    const input = `<div><p>Nested paragraph</p></div>`
    const ast = parse(input)

    expect(ast).toStrictEqual([
        {
            type: 'Element',
            tagName: 'div',
            content: '<div>',
            attributes: [],
            children: [
                {
                    type: 'Element',
                    tagName: 'p',
                    content: '<p>',
                    attributes: [],
                    children: [
                        {
                            type: 'Text',
                            content: 'Nested paragraph',
                            attributes: [],
                            children: [],
                            tagName: null
                        }
                    ]
                }
            ]
        }
    ])
})

test('Parses elements with attributes', () => {
    const input = `<button ".btn" "#submit">Click me</button>`
    const ast = parse(input)

    expect(ast).toStrictEqual([
        {
            type: 'Element',
            content: '<button \".btn\" \"#submit\">',
            tagName: 'button',
            attributes: [
                { name: 'className', value: 'btn' },
                { name: 'id', value: 'submit' }
            ],
            children: [
                {
                    type: 'Text',
                    content: 'Click me',
                    attributes: [],
                    children: [],
                    tagName: null
                }
            ]
        }
    ])
})

test('Parses self-closing elements', () => {
    const input = `<img {image.jpg} "A picture" />`
    const ast = parse(input)

    expect(ast).toStrictEqual([
        {
            type: 'Element',
            content: '<img {image.jpg} \"A picture\" />',
            tagName: 'img',
            attributes: [
                { name: 'src', value: 'image.jpg' },
                { name: 'alt', value: 'A picture' }
            ],
            children: []
        }
    ])
})

test('Parses mixed content with text and elements', () => {
    const input = `<div>Text before <span>inner text</span> and after</div>`
    const ast = parse(input)

    expect(ast).toStrictEqual([
        {
            type: 'Element',
            content: '<div>',
            tagName: 'div',
            attributes: [],
            children: [
                { 
                    type: 'Text', 
                    content: 'Text before ', attributes: [],
                    children: [],
                    tagName: null },
                {
                    type: 'Element',
                    tagName: 'span',
                    content: '<span>',
                    attributes: [],
                    children: [
                        { 
                            type: 'Text', 
                            content: 'inner text',
                            attributes: [],
                            children: [],
                            tagName: null
                        }
                    ]
                },
                { 
                    type: 'Text', 
                    content: ' and after',
                    attributes: [],
                    children: [],
                    tagName: null
                }
            ]
        }
    ])
})

test('Parses element with style attribute and multiple nested children', () => {
    const input = `
        <div style={color: red;}>
            <h1 ".title">Title</h1>
            <p>Paragraph text</p>
        </div>
    `
    const ast = parse(input);

    expect(ast).toStrictEqual([
    {
        type: 'Element',
        content: '<div style={color: red;}>',
        tagName: 'div',
        attributes: [
            { name: 'style', value: '{color: red;}' }
        ],
        children: [
            {
                type: 'Element',
                tagName: 'h1',
                content: '<h1 \".title"\>',
                attributes: [
                    { name: 'className', value: 'title' }
                ],
                children: [
                    { 
                        type: 'Text', 
                        content: 'Title',
                        attributes: [],
                        children: [],
                        tagName: null
                    }
                ]
            },
            {
                type: 'Element',
                content: '<p>',
                tagName: 'p',
                attributes: [],
                children: [
                    { 
                        type: 'Text', 
                        content: 'Paragraph text',
                        attributes: [],
                        children: [],
                        tagName: null 
                    }
                ]
            }
        ]
    }
])})
