import test, { expect } from '@playwright/test'
import { Signal } from '../src/signal'

test.describe('Signal Class', () => {

    test('should initialise with a primitive value', () => {
        const signal = new Signal(10)
        expect(signal.get).toBe(10)
    })
    test('should update value correctly with set', () => {
        const signal = new Signal(10)
        signal.set(20)
        expect(signal.get).toBe(20)
    })
    test('should support functional updates in set', () => {
        const signal = new Signal(10)
        signal.set(prev => prev + 5)
        expect(signal.get).toBe(15)
    })
})
