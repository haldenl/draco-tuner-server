"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const db_1 = require("./db");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 3000;
const db = new db_1.default(path.resolve(__dirname, '../codar.db'));
app.get('/charts/count', (req, res) => {
    db.numCharts(rows => {
        console.log(rows);
        res.send(rows);
    }, err => {
        console.log(err);
    });
});
app.get('/pairs/count', (req, res) => {
    db.numPairs(rows => {
        console.log(rows);
        res.send(rows);
    }, err => {
        console.log(err);
    });
});
app.get('/charts/:from-:to', (req, res) => {
    const { from, to } = req.params;
    db.getCharts(rows => {
        console.log(rows);
        const chartsToSend = rows.slice(from, to);
        res.send(chartsToSend);
    }, err => {
        console.log(err);
    });
});
app.get('/pairs/:from-:to', (req, res) => {
    const { from, to } = req.params;
    db.getPairs(rows => {
        console.log(rows);
        const pairsToSend = rows.slice(from, to);
        res.send(pairsToSend);
    }, err => {
        console.log(err);
    });
});
app.post('/charts/add', (req, res) => {
    const charts = req.body.charts;
    console.log(charts);
    db.addCharts(charts, () => {
        console.log('Added charts: ', charts);
        res.send({
            added: charts,
        });
    }, err => {
        console.log(err);
    });
});
app.post('/charts/update', (req, res) => {
    const charts = req.body.charts;
    console.log(charts);
    db.updateCharts(charts, () => {
        console.log('Updated charts: ', charts);
        res.send({
            updated: charts,
        });
    }, err => {
        console.log(err);
    });
});
app.post('/pairs/add', (req, res) => {
    const pairs = req.body.pairs;
    console.log(pairs);
});
app.listen(port, () => console.log(`Listening on port ${port}.`));
//# sourceMappingURL=server.js.map