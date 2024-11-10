import { test, expect } from '@playwright/test'
import { extractBetween, lookAheadFor } from '../src/core/utils'

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