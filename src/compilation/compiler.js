// @ts-check
const SECTION_ORDER = ["versioninfo", "visgroups", "viewsettings", "world", "entity", "cameras", "cordons"];
const KEY_ORDER = ["Property", "Object"];

/** Classifies a key in an object as either an ObjectNode or a PropertyNode based on the value */
function classifyValue(value) {
    return (typeof value === "string")
        ? "Property"
        : "Object";
}
/** Sorts two keys in the order they should appear in the VMF */
function sortKeys(obj, keyA, keyB) {
    const classA = classifyValue(obj[keyA]);
    const classB = classifyValue(obj[keyB]);
    if (classA !== classB) {
        return KEY_ORDER.indexOf(classA) - KEY_ORDER.indexOf(classB);
    }
    return SECTION_ORDER.indexOf(keyA) - SECTION_ORDER.indexOf(keyB);
}

/**
 * Stringifies a node into a partial VMF string
 * @param {string} key
 * @param {string|string[]|object|Object[]} value
 * @param {string} indent The indent to prefix each line with
 * @returns {string} The VMF representation. Does not include trailing newline
 */
function stringifyKeyValue(key, value, indent) {
    // if it's a property, the representation is simple
    if (classifyValue(value) === "Property") {
        return `${indent}"${key}" "${value}"`;
    }
    // if it's a subsection we need to stringify it
    const stringified = stringifySection(value, "\t" + indent);
    return `${indent}${key}\n` +
        `${indent}{\n` +
        `${stringified ? stringified + "\n" : ""}` +
        `${indent}}`;
}

/**
 * Compiles a (sub-)section into a partial VMF string
 * @param {Object} obj The data to compile 
 * @param {string} indent The indent to prefix each line with
 * @returns {string} The compiled VMF section. Does not contain wrapping curly brackets.
 */
function stringifySection(obj, indent = "") {
    const keys = Object.keys(obj).sort((a, b) => sortKeys(obj, a, b));
    return keys.reduce((lines, key) => {
        const values = Array.isArray(obj[key])
            ? obj[key]
            : [obj[key]];
        return lines.concat(values.map(v => stringifyKeyValue(key, v, indent)));
    }, []).join("\n");
}

/**
 * Compiles a JSON representation of a VMF file into a VMF source string
 * @param {Object} json The JSON to compile
 * @returns {string} The VMF representation
 */
module.exports = function compile(json) {
    return stringifySection(json);
}
