import * as express from 'express';
import * as path from 'path';
import DracoDB from './db';

const app = express();
const port = 3000;

const db = new DracoDB(path.resolve(__dirname, '../codar.db'));

app.get('/charts/count', (req, res) => {
  db.numCharts(
    rows => {
      console.log(rows);
    },
    err => {
      console.log(err);
    }
  );
});

app.get('/charts/:from-:to', (req, res) => {
  const { from, to } = req.params;
});

app.listen(port, () => console.log(`Listening on port ${port}.`));
