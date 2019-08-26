import * as fs from 'fs';
import * as path from 'path';
import DracoDB from './db';

const db = new DracoDB(path.resolve(__dirname, '../codar.db'));

function sleep(time) {
  return new Promise(res => {
    setTimeout(res, time);
  });
}

async function main() {
  await sleep(1000);

  db.getPairs(
    rows => {
      fs.writeFileSync(path.resolve(__dirname, 'pairs.json'), JSON.stringify(rows));
    },
    err => {
      console.log(err);
    }
  );
}

main();
