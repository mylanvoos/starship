import { test, expect } from '@playwright/test'
import { tokeniser } from '../src/core/compiler/tokeniser'
import path from 'path'
import fs from 'fs'
import { extractBetween, lookAheadFor } from '../src/core/utils'
import { StarshipAttribute } from '../src/core/compiler/types'

const appPath = path.resolve(__dirname, '../src/App.uss')

test.describe('Tokeniser tests', () => {
    test('Tokenises inputs correctly', async () => {
        const code = `<div ".container"> </div>`
        const tokens = tokeniser(code)
        const tokenArray = Array.from(tokens)

        console.log(tokenArray)

        expect(tokens[0].attributes).toBeInstanceOf(Set)
        expect(tokenArray).toBe([
            {
              type: 'div',
              isClosing: false,
              isSelfClosing: false,
              attributes: new Set([{ type: 'class', value: 'container' }]),
              content: '<div ".container">',
              start: 0,
              end: 18
            },
            { type: 'text', content: 'div', start: 31, end: 37 }
          ])

    })
})

test.describe('Strings utils working', () => {
    test('LookAheadFor working', () => {
        const string = "<div className='tailor'></div>"
        expect(lookAheadFor(string, 0, "/>")).toBe(false)
        expect(lookAheadFor(string, 0, "</")).toBe(true)
    })

    test('ExtractBetween working', () => {
        const string = "<div className='tailor'></div>"
        expect(extractBetween(string, "<", ">")).toBe("div className='tailor'")
    })
})