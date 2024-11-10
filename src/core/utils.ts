export function lookAheadFor(source: string, pos: number, stopAt: string): boolean {
    const stopLength = stopAt.length

    while (pos <= source.length - stopLength) {
        if (source.substring(pos, pos + stopLength) === stopAt) {
            return true;
        }
        pos++
    }
    return false
}


export function capitaliseFirstLetter(str: string) {
    return str.at(0).toUpperCase() + str.substring(1)
}

export function extractBetween(source: string, ...delimiters: string[]): string | null {
    if (delimiters.length < 2) {
        throw new Error('At least two delimiters are required')
    }
    let str = source.toString()
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
