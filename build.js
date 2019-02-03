const fs = require('fs');
const FILE_NAME = 'src/index.ts';
let data = fs.readFileSync(FILE_NAME).toString();
const key = '/*! Viage Version ';
const endKey = '*/';
const pj = require('./package.json');

let start = data.indexOf(key);
if (start !== -1) {
  start += key.length;
  let end = data.indexOf(endKey, start);
  let oldVersion = data.substring(start, end);
  data = data.replace(oldVersion, `${pj.version} `);
  fs.writeFileSync(FILE_NAME, data);
}