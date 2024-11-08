import { Token } from "./types"

export default {}

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