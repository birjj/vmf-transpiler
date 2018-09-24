const fs = require("fs");
const transpiler = require("..");

fs.readFile("./vmf_demo.vmf", (err, data) => {
    if(err) {
        return console.error(err);
    }

    const str = data.toString();
    const parsed = transpiler.parse(str);
    const json = JSON.stringify(parsed, null, "\t");
    console.log(json);
});
