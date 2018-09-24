// @ts-check
/** @typedef {import("./parsing/parser").AST} AST */

const tokenizer = require("./parsing/tokenizer");
const parser = require("./parsing/parser");
const transformer = require("./parsing/transformer");
const compiler = require("./compilation/compiler");

module.exports = {
    /**
     * Parses a VMF string into JSON
     * @param {string} input The VMF source string to parse
     * @param {Object} options The options object
     * @returns {AST|Object} Either the AST or the JSON representation, depending on options
     */
    parse(input, options) {
        options = Object.assign({
            ast: false
        }, options);

        const tokens = tokenizer(input);
        const ast = parser(tokens);

        return options.ast ? ast : transformer(ast);
    },

    /**
     * Compiles a JSON object into VMF
     * @param {Object} input The JSON object to compile
     * @returns {string} The VMF representation
     */
    compile(input) {
        return compiler(input);
    }
};