import { Token } from "./types"

export default {}

class Node<T> {
  data: T
  next: Node<T> | null
  constructor(data: T) {
      this.data = data
      this.next = null
  }
  toString(): string {
      return this.data.toString()
  }
}
export class Stack<T> {
  top: Node<T>
  size: number
  constructor() {
      this.top = null
      this.size = 0
  }
  push(value: T) {
      const node = new Node(value)
      node.next = this.top
      this.top = node
      this.size++
  }
  pop(): T {
      const data = this.size === 0 ? null : this.top.data
      this.top = this.top.next
      this.size--
      return data
  }
  clone(): Stack<T> {
      const newStack = new Stack<T>()
      let current = this.top
      const tempArray: T[] = [...Array(this.size)] // fixed size for optimality

      while (current) {
          tempArray.push(current.data)
          current = current.next
      }
      for (let i = tempArray.length - 1; i >= 0; i--) {
          newStack.push(tempArray[i])
      }
        
      return newStack
  }
  toString(): string {
      if (this.size === 0) {
          return "[]"
      }
      let result = "["
      let current = this.top
      
      while (current) {
          // @ts-ignore
          if ('type' in current.data && 'value' in current.data) {
              // Handle Token type specifically
              const token = current.data as Token
              result += `\n  {`
              result += `\n    type: "${token.type}",`
              result += `\n    value: "${token.value}"`
              if (token.content !== undefined) {
                  result += `,\n    content: "${token.content}"`
              }
              if (token.selfClosing !== undefined) {
                  result += `,\n    selfClosing: ${token.selfClosing}`
              }
              result += '\n  }'
          } else {
              // Generic fallback for other types
              result += JSON.stringify(current.data)
          }
          if (current.next) {
              result += ","
          }
          current = current.next
      }
      return result + "\n]"
  } 
}


// String extraction utility to make our lives easier
// TODO: Ship this in its own TypeScript library?
declare global {
    interface String {
      extractBetween(...delimiters: string[]): string | null;
    }
}
  
String.prototype.extractBetween = function(...delimiters: string[]): string | null {
    if (delimiters.length < 2) {
      throw new Error('At least two delimiters are required')
    }
    
    let str = this.toString()
    let result = str
    
    try {
      for (let i = 0; i < delimiters.length - 1; i += 2) {
        const startDelim = delimiters[i];
        const endDelim = delimiters[i + 1]
        
        const startIndex = result.indexOf(startDelim)
        if (startIndex === -1) return null
        
        result = result.slice(startIndex + startDelim.length)
        
        let endIndex = -1
        let nestLevel = 0
        let searchIndex = 0
        
        while (searchIndex < result.length) {
          const nextStart = result.indexOf(startDelim, searchIndex)
          const nextEnd = result.indexOf(endDelim, searchIndex)
          
          if (nextEnd === -1) return null
          
          if (nextStart === -1 || nextEnd < nextStart) {
            if (nestLevel === 0) {
              endIndex = nextEnd
              break
            }
            nestLevel--
            searchIndex = nextEnd + endDelim.length
          } else {
            nestLevel++
            searchIndex = nextStart + startDelim.length
          }
        }
        
        if (endIndex === -1) return null
        result = result.slice(0, endIndex)
      }
      
      return result
    } catch (error) {
      return null
    }
}
  
  // Prevent the new method from showing up in for...in loops
Object.defineProperty(String.prototype, 'extractBetween', {
    enumerable: false
})