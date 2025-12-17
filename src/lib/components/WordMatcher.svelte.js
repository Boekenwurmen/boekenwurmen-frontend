/**
 * Matcht woorden met regex en woordgrenzen
 */
export default class RegexWordMatcher {
    /**
     * @param {string[]} words
     */
    constructor(words) {
        if (!words || words.length == 0) {
            this.regex = null;
            // this.regex = /(?!)/; // won't match anything
        } else {
            this.regex = new RegExp(`${words.join("|")}`, "gi");
        }
    }

    /**
     * @param {string} text
     * @returns {string[]} gematchte woorden (uniek)
     */
    match(text) {
        if (!this.regex) {
            return []
        }
        const matches = text.match(this.regex) ?? [];
        return matches;
        // return [...new Set(matches.map(w => w.toLowerCase()))];
    }

    /**
     * @param {string} text
     * @returns {{ startIndex: number; endIndex: number; }[]} text split on regex matches
     */
    split(text) {
        if (!this.regex || !text) {
            return [];
        }
        const matches = [...text.matchAll(this.regex)];

        return matches.map(match => {
            const word = match[0];
            const startIndex = match.index;
            return {
                startIndex: startIndex,
                endIndex: startIndex + word.length,
            }
        });
        // // text.search(this.regex);
        // const parts = text.split(this.regex);
        // const matchedParts = text.match(this.regex) ?? [];
        // const result = [];
        
        // for (let i = 0; i < parts.length; i++) {
        //     result.push({
        //         matched: i === 0 ? null : matchedParts[i - 1],
        //         unmatched: parts[i]
        //     });
        // }
        
        // return result;
    }
}