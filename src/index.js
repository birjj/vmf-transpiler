// @ts-check
const tokenizer = require("./parsing/tokenizer");
const parser = require("./parsing/parser");
const transformer = require("./parsing/transformer");

module.exports = {
    /**
     * Parses a VMF into JSON
     * @param {string} input The VMF source string to parse
     * @param {object} options The options object
     */
    parse(input, options) {
        options = Object.assign({
            ast: false
        }, options);

        const tokens = tokenizer(input);
        const ast = parser(tokens);

        return options.ast ? ast : transformer(ast);
    }
};