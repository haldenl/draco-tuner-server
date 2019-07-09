import * as express from 'express';

const app = express();

app.get('/charts/:from-:to', (req, res) => {
  const { from, to } = req.params;
});
