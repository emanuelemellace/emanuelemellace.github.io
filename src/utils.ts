/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

import { user } from "./assets/db.models";

const fs = require('fs');

export function readFileDb(): user[] {
  const rawdata = fs.readFileSync('./src/assets/db.json');
  return JSON.parse(rawdata);
}

export function writeFileDb(data: user[]) {
  fs.writeFile(
    './src/assets/db.json',
    JSON.stringify(data),
    (err: any) => {
      if (err) throw err;
      console.log('Data written to file');
    }
  );
}
