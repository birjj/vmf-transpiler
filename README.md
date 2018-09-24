VMF Transpiler
=============

VMF is the format used by the Hammer editor to store maps before their
compilation. Since VMF has a syntax similar to JSON, this library provides tools to transpile back and forth between the two.

Based on [leops/vmfparser](https://github.com/leops/vmfparser).

## Usage
The module exports an object with two methods:

<dl>
    <dt><code>parse(input, [options])</code></dt>
    <dd>
        Parses a VMF source into JSON. <code>input</code> is a VMF source string, and <code>options</code> is an optional object with the following options:
        
```JS
{
    "ast": false, // if true, return the Abstract Syntax Tree instead of the JSON representation
}
```
</dd>
    <dt><code>compile(input)</code></dt>
    <dd>
        Compiles a JSON source into VMF. <code>input</code> is a JSON object as returned by <code>parse</code>.
    </dd>
</dl>

## Multiple values per-key
This is a unique functionnality of VMF, non-existent in JSON: the ability to
have multiple key with the same name but different values. Here's an example:

```JSON
{
    "someKey": 42,
    "someKey": "someValue"
}
```

If you try to parse this, you'll obtain this JS object:

```JS
{
    someKey: "someValue"
}
```

But with VMF, you can do this:

```VMF
"someKey" "42"
"someKey" "someValue"
```

And you'll get this object instead :

```JS
{
    someKey: ["42", "someValue"]
}
```
