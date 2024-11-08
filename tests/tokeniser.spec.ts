import { test, expect } from '@playwright/test'
import { Stack, tokenise } from '../src/compiler/tokeniser'
import path from 'path'
import fs from 'fs'
import { Token } from '../src/compiler/types'

const appPath = path.resolve(__dirname, '../src/App.uss')

function getTokenisedContent() {
    const content = fs.readFileSync(appPath)
    return tokenise(content.toString())
}

test.describe('Tokeniser tests', () => {
    test('Tokenises App.uss correctly', async () => {
        const tokens = getTokenisedContent()

        expect(tokens).toBeInstanceOf(Stack)
    })
})