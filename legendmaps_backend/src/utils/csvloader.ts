const fs = require("fs");
const { parse } = require("csv-parse");

export const fetchCsv = (fileName: string, callback: (row: string) => void) => {
    fs.createReadStream(fileName)
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", function (row) {
            callback(row);
        });
};

module.exports = { fetchCsv };
