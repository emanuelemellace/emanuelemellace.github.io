/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFileDb = exports.readFileDb = void 0;
const fs = require('fs');
function readFileDb() {
    const rawdata = fs.readFileSync('./src/assets/db.json');
    return JSON.parse(rawdata);
}
exports.readFileDb = readFileDb;
function writeFileDb(data) {
    fs.writeFile('./src/assets/db.json', JSON.stringify(data), (err) => {
        if (err)
            throw err;
        console.log('Data written to file');
    });
}
exports.writeFileDb = writeFileDb;
//# sourceMappingURL=utils.js.map