const fs = require("fs");
const parser = require("./src/index");

fs.readFile("./test/test_rope.vmf", (err, data) => {
    if(err) {
        return console.error(err);
    }

    const str = data.toString();
    const parsed = parser(str);
    const json = JSON.stringify(parsed, null, "\t");
});
