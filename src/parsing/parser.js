/** @typedef {import("./tokenizer.js").Token} Token */
/**
 * @typedef AST
 * @property {"File"} type
 * @property {(PropertyNode|ObjectNode)[]} body The content of the AST
 */
/**
 * @typedef PropertyNode Represents a simple key-value pair
 * @property {"Property"} type
 * @property {string} name The name of the node (aka the key)
 * @property {string} value The value of the node
 */
/**
 * @typedef ObjectNode Represents a named sub-section
 * @property {"Object"} type
 * @property {string} name The name of the node (aka the key)
 * @property {(PropertyNode|ObjectNode)[]} body The content of the object
 */

/**
 * Parses a tokenized VMF into an Abstract Syntax Tree
 * @param {Token[]} tokens
 * @returns {AST}
 */
module.exports = function parser(tokens) {
    let current = 0;

    function walk() {
        const node = {};
        let token = tokens[current];

        switch(token.type) {
            case "string":
                // a string indicates that we have a simple property, as subsection names aren't quoted
                node.type = "Property";
                node.name = token.value;

                token = tokens[++current];
                node.value = token.value;

                current++;
                return node;

            case "name":
                // a name indicates that we're starting a subsection
                node.type = "Object";
                node.name = token.value;
                node.body = [];
                
                token = tokens[current += 2];
                while (
                    (token.type !== "bracket") ||
                    (token.type === "bracket" && token.value !== "}")
                ) {
                    node.body.push(walk());
                    token = tokens[current];
                }
                current++;
                return node;

            default:
                throw new TypeError(`Unknown token type: ${token.type}`);
        }
    }

    var ast = {
        type: "File",
        body: []
    };

    while (current < tokens.length) {
        ast.body.push(walk());
    }

    return ast;
}
