"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const db_1 = require("./db");
const app = express();
const port = 3000;
const db = new db_1.default(path.resolve(__dirname, '../codar.db'));
app.get('/charts/count', (req, res) => {
    db.numCharts(rows => {
        console.log(rows);
    }, err => {
        console.log(err);
    });
});
app.get('/charts/:from-:to', (req, res) => {
    const { from, to } = req.params;
});
app.listen(port, () => console.log(`Listening on port ${port}.`));
//# sourceMappingURL=server.js.map