import { expect, test } from '@playwright/test'
import * as framework from '../src/core/framework'

test.describe('Pattern matching working', () => {
  test('Creating Some objects', () => {
    const value = framework.some<number>(42)
    expect(value.value).toBe(42)
  })
  test('Test Some/None value matching', () => {
    const value = framework.some<number>(42)
    const val = framework.none
    const result = (value) => framework.match(value, [
      [framework.Some, (v) => `Got Some(${v.value})`],
      [framework.None, (v) => "Got None"],
      [framework._, "Impossible case"]
    ])
    expect(result(value)).toBe('Got Some(42)')
    expect(result(val)).toBe('Got None')
  })
  test('Test simple number matching', () => {
    const five = 5
    const eleven = 11
    const negEight = -8
    const a = 'a'
    const numResult = (value) => framework.match(value, [
      [framework.when(n => n > 10), "Greater than 10"],
      [framework.when(n => n < 0), "Negative"],
      [5, "Exactly 5"],
      [framework._, "Something else"]
    ])
    expect(numResult(five)).toBe("Exactly 5")
    expect(numResult(eleven)).toBe("Greater than 10")
    expect(numResult(negEight)).toBe("Negative")
    expect(numResult(a)).toBe("Something else")
  })
  test('Test object matching', () => {
    const obj = { x: 1, y: "HELLO" }
    const objTwo = { x: 2, y: "hi" }
    const objThree = { x: -5, y: "meow" }
    const objFour = "hello"
    const numResult = (obj) => framework.match(obj, [
      [{ x: framework.when(n => n > 0), y: /^h/ }, "Matched!"],
      [{ x: framework.when(n => n <= 0), y: /^m/ }, "Matched but differently"],
      [framework._, "No match"]
    ])
    expect(numResult(obj)).toBe("No match")
    expect(numResult(objTwo)).toBe("Matched!")
    expect(numResult(objThree)).toBe("Matched but differently")
    expect(numResult(objFour)).toBe("No match")
  })
})