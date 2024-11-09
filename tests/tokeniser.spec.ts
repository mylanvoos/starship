import { test, expect } from '@playwright/test'
import { tokenise } from '../src/core/compiler/tokeniser'
import path from 'path'
import fs from 'fs'
import { extractBetween, lookAheadFor } from '../src/core/utils'

const appPath = path.resolve(__dirname, '../src/App.uss')

function getTokenisedContent() {
    const content = fs.readFileSync(appPath)
    return tokenise(content.toString())
}

test.describe('Tokeniser tests', () => {
    test('Tokenises App.uss correctly', async () => {
        const code = `
            <div ".container">
                <h1 "#text">Starship 🛰️</h1>
                <p "#text">The classic button experiment to test reactivity...</p>
                <button on:click={() => setCounter(counter.value - 1)}> -1 </button>
                    { counter }
                <button on:click={() => setCounter(counter.value + 1)}> +1 </button>
                <p "#text">{ message }</p>
                <img {https://science.nasa.gov/wp-content/uploads/2024/03/voyager-record-diagram.jpeg} />
                <a {../link}>Link here</a>
            </div>`

        const tokens = tokenise(code)

    })
})

test.describe('Strings utils working', () => {
    test('LookAheadFor working', () => {
        const string = "<div className='tailor'></div>"
        expect(lookAheadFor(string, 0, "/>")).toBe(true)
    })

    test('ExtractBetween working', () => {
        const string = "<div className='tailor'></div>"
        expect(extractBetween(string, "<", ">")).toBe("div className='tailor'")
    })
})