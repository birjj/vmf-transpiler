// @ts-check
const WHITESPACE = /\s/;
const NAME = /[a-z0-9_]/i;

/**
 * @typedef Token
 * @property {"bracket"|"name"|"string"} type The type of token
 * @property {string} value The content of the token
 */

/**
 * Tokenizes a VMF source
 * @param {String} input 
 * @returns {Token[]}
 */
module.exports = function tokenize(input) {
    /** @type {Token[]} */
    const tokens = [];
    let current = 0;

    while (current < input.length) {
        let char = input[current];

        if (WHITESPACE.test(char)) {
            // we should just ignore whitespace
            current++;
        } else if (char === "{" || char === "}") {
            // brackets are tokenized individually
            tokens.push({
                type: "bracket",
                value: char
            });

            current++;
        } else if (char === '"') {
            // strings are tokenized in their entirety
            let value = "";
            char = input[++current];

            while (char !== '"') {
                value += char;
                char = input[++current];
            }

            tokens.push({
                type: "string",
                value
            });

            current++;
        } else if (NAME.test(char)) {
            // names are tokenized in their entirety
            let value = "";

            while (NAME.test(char)) {
                value += char;
                char = input[++current];
            }

            tokens.push({
                type: "name",
                value
            });
        } else {
            // if we reach this point, we've encountered a character we don't know how to handle
            throw new TypeError(`Unknown character: ${char} at position ${current}`);
        }
    }

    return tokens;
}
