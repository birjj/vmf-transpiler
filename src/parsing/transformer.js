// @ts-check
/** @typedef {import("./parser").AST} AST */
/** @typedef {import("./parser").ObjectNode} ObjectNode */
/** @typedef {import("./parser").PropertyNode} PropertyNode */

/**
 * Sets the value of a property, potentially merging with existing values
 * @param {Object} obj The JSON we're working on
 * @param {string} key The key to set the value of
 * @param {string} value The value to set
 */
function addProp(obj, key, value) {
    const currentValue = obj[key];
    // if it doesn't have a value already, just set it
    if (typeof currentValue === "undefined") {
        obj[key] = value;
        return;
    }

    // otherwise handle merging
    if (currentValue instanceof Array) {
        currentValue.push(value);
    } else {
        obj[key] = [currentValue, value];
    }
}

/**
 * Used as .reduce callback. Transforms a node into JSON
 * @param {Object} obj The JSON we're working on
 * @param {ObjectNode|PropertyNode} node The node we're working on
 */
function reduce(obj, node) {
    if (node.type === "Property") {
        addProp(obj, node.name, node.value);
    } else if (node.type === "Object") {
        addProp(obj, node.name, node.body.reduce(reduce, {}));
    }

    return obj;
}

/**
 * Transforms an AST into JSON
 * @param {AST} ast The AST representation
 * @return {Object} The JSON representation
 */
module.exports = function transform(ast) {
    return ast.body.reduce(reduce, {});
}
