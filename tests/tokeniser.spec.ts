import { test, expect } from '@playwright/test'
import { tokeniser } from '../src/core/compiler/tokeniser'
import { StarshipAttribute } from '../src/core/compiler/types'

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

test.describe('Tokeniser tests', () => {
    test('Tokenises tag with a class attribute', async () => {
        const code = `<div ".container"> </div>`
        const tokens = tokeniser(code)
        const tokenArray = Array.from(tokens)

        expect(tokens[0].attributes).toBeInstanceOf(Set)
        expect(tokenArray).toStrictEqual([
            {
                type: 'div',
                isClosing: false,
                isSelfClosing: false,
                attributes: new Set<StarshipAttribute>([{ name: 'className', value: 'container'}]),
                content: '<div ".container">',
                start: 0,
                end: 18
              },
              {
                type: 'div',
                isClosing: true,
                isSelfClosing: false,
                attributes: null,
                content: '</div>',
                start: 19,
                end: 25
              }
          ])
    })
    test('Tokenises tag with an ID attribute', async () => {
        const code = `<section "#main"></section>`
        const tokens = tokeniser(code)
        const tokenArray = Array.from(tokens)

        expect(tokenArray).toStrictEqual([
            {
                type: 'section',
                isClosing: false,
                isSelfClosing: false,
                attributes: new Set<StarshipAttribute>([{ name: 'id', value: 'main'}]),
                content: '<section "#main">',
                start: 0,
                end: 17
            },
            {
                type: 'section',
                isClosing: true,
                isSelfClosing: false,
                attributes: null,
                content: '</section>',
                start: 17,
                end: 27
            }
        ])
    })

    test('Tokenises self-closing tag with path attribute', async () => {
        const code = `<img {https://example.com/image.jpg}/>`
        const tokens = tokeniser(code)
        const tokenArray = Array.from(tokens)

        expect(tokenArray).toStrictEqual([
            {
                type: 'img',
                isClosing: false,
                isSelfClosing: true,
                attributes: new Set<StarshipAttribute>([
                    { name: 'src', value: 'https://example.com/image.jpg' }
                ]),
                content: '<img {https://example.com/image.jpg}/>',
                start: 0,
                end: 38
            }
        ])
    })

    test('Tokenises tag with multiple attributes', async () => {
        const code = `<input {text} "#username" @"Enter username">`
        const tokens = tokeniser(code)
        const tokenArray = Array.from(tokens)

        expect(tokenArray).toStrictEqual([
            {
                type: 'input',
                isClosing: false,
                isSelfClosing: false,
                attributes: new Set<StarshipAttribute>([
                    { name: 'type', value: 'text' },
                    { name: 'id', value: 'username' },
                    { name: 'placeholder', value: 'Enter username' }
                ]),
                content: '<input {text} "#username" @"Enter username">',
                start: 0,
                end: 44
            }
        ])
    })

    test('Tokenises tag with event attribute', async () => {
        const code = `<button on:click={() => setCounter(counter + 1)}></button>`
        const tokens = tokeniser(code)
        const tokenArray = Array.from(tokens)

        expect(tokenArray).toStrictEqual([
            {
                type: 'button',
                isClosing: false,
                isSelfClosing: false,
                attributes: new Set<StarshipAttribute>([
                    { name: 'on:click', value: '{() => setCounter(counter + 1)}' }
                ]),
                content: '<button on:click={() => setCounter(counter + 1)}>',
                start: 0,
                end: 49
            },
            {
                type: 'button',
                isClosing: true,
                isSelfClosing: false,
                attributes: null,
                content: '</button>',
                start: 49,
                end: 58
            }
        ])
    })

    test('Tokenises nested tags correctly', async () => {
        const code = `<div><p>Text inside</p></div>`
        const tokens = tokeniser(code)
        const tokenArray = Array.from(tokens)

        expect(tokenArray).toStrictEqual([
            {
                type: 'div',
                isClosing: false,
                isSelfClosing: false,
                attributes: null,
                content: '<div>',
                start: 0,
                end: 5
            },
            {
                type: 'p',
                isClosing: false,
                isSelfClosing: false,
                attributes: null,
                content: '<p>',
                start: 5,
                end: 8
            },
            { 
                type: 'text', 
                content: 'Text inside', 
                start: 8, 
                end: 19 
            },
            {
                type: 'p',
                isClosing: true,
                isSelfClosing: false,
                attributes: null,
                content: '</p>',
                start: 19,
                end: 23
            },
            {
                type: 'div',
                isClosing: true,
                isSelfClosing: false,
                attributes: null,
                content: '</div>',
                start: 23,
                end: 29
            }
        ])
    })

    test('Tokenises comprehensive test correctly', () => {
        const tokens = tokeniser(code)
        const tokenArray = Array.from(tokens)

        expect(tokenArray).toStrictEqual([
            {
                type: 'div',
                isClosing: false,
                isSelfClosing: false,
                attributes: new Set<StarshipAttribute>([ { name: 'id', value: 'container'}]),
                content: '<div "#container">',
                start: 1,
                end: 19
            },
            {
                type: 'h1',
                isClosing: false,
                isSelfClosing: false,
                attributes: new Set<StarshipAttribute>([ 
                    { name: 'className', value: 'text'},
                    { name: 'style', value: 'style={color:red;}'}
                ]),
                content: '<h1 ".text" style={color:red;}>',
                start: 24,
                end: 55
            },
            { type: 'text', content: 'Starship 🛰️', start: 55, end: 67 },
            {
                type: 'h1',
                isClosing: true,
                isSelfClosing: false,
                attributes: null,
                content: '</h1>',
                start: 67,
                end: 72
            },
            {
                type: 'button',
                isClosing: false,
                isSelfClosing: false,
                attributes: new Set<StarshipAttribute>([
                  { name: 'type', value: 'submit' },
                  {
                      name: 'on:click',
                      value: '{() => setCounter(counter.value - 1)}'
                  }
                ]),
                content: '<button {submit} on:click={() => setCounter(counter.value - 1)}>',
                start: 77,
                end: 141
            },
            { type: 'text', content: ' -1 ', start: 141, end: 145 },
            {
              type: 'button',
              isClosing: true,
              isSelfClosing: false,
              attributes: null,
              content: '</button>',
              start: 145,
              end: 154
            },
            {
              type: 'text',
              content: '\n    { counter }\n    ',
              start: 154,
              end: 175
            },
            {
              type: 'img',
              isClosing: false,
              isSelfClosing: true,
              attributes: new Set<StarshipAttribute>([
                {
                    name: 'src',
                    value: 'https://science.nasa.gov/wp-content/uploads/2024/03/voyager-record-diagram.jpeg'
                },
                { name: 'alt', value: 'NASA Voyager' },
                { name: 'width', value: '50' },
                { name: 'height', value: '50' }
              ]),
              content: '<img {https://science.nasa.gov/wp-content/uploads/2024/03/voyager-record-diagram.jpeg} "NASA Voyager" [50,50]/>',
              start: 175,
              end: 286
            },
            {
              type: 'a',
              isClosing: false,
              isSelfClosing: false,
              attributes: new Set<StarshipAttribute>([ { name: 'href', value: '../link' }]),
              content: '<a {../link}>',
              start: 291,
              end: 304
            },
            { type: 'text', content: 'Link here', start: 304, end: 313 },
            {
              type: 'a',
              isClosing: true,
              isSelfClosing: false,
              attributes: null,
              content: '</a>',
              start: 313,
              end: 317
            },
            {
              type: 'label',
              isClosing: false,
              isSelfClosing: false,
              attributes: new Set<StarshipAttribute>([{ name: 'for', value: 'username'}]),
              content: '<label {username}>',
              start: 322,
              end: 340
            },
            { type: 'text', content: 'Username:', start: 340, end: 349 },
            {
              type: 'label',
              isClosing: true,
              isSelfClosing: false,
              attributes: null,
              content: '</label>',
              start: 349,
              end: 357
            },
            {
              type: 'input',
              isClosing: false,
              isSelfClosing: true,
              attributes: new Set<StarshipAttribute>([
                { name: 'type', value: 'text'},
                { name: 'id', value: 'username'},
                { name: 'placeholder', value: 'Placeholder text'}
              ]),
              content: '<input {text} "#username" @"Placeholder text" />',
              start: 362,
              end: 410
            },
            {
              type: 'div',
              isClosing: true,
              isSelfClosing: false,
              attributes: null,
              content: '</div>',
              start: 411,
              end: 417
            }
          ])
    })
})
