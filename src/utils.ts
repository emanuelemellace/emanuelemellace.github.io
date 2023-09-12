/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

const fs = require('fs');

export function readFile() {
  const rawdata = fs.readFileSync('./src/assets/db.json');
  return JSON.parse(rawdata);
}
