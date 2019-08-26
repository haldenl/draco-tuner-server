"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const db_1 = require("./db");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
const port = 3333;
const db = new db_1.default(path.resolve(__dirname, '../codar.db'));
app.all('/*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST');
    return next();
});
app.get('/charts/count', (req, res) => {
    db.numCharts(rows => {
        res.send(rows);
    }, err => {
        console.log(err);
    });
});
app.get('/pairs/count', (req, res) => {
    db.numPairs(rows => {
        res.send(rows);
    }, err => {
        console.log(err);
    });
});
app.get('/charts/get/:from-:to', (req, res) => {
    const { from, to } = req.params;
    db.getCharts(rows => {
        const chartsToSend = rows.slice(from, to);
        res.send(chartsToSend);
    }, err => {
        console.log(err);
    });
});
app.get('/pairs/get/:from-:to', (req, res) => {
    const { from, to } = req.params;
    db.getPairs(rows => {
        const pairsToSend = rows.slice(from, to);
        res.send(pairsToSend);
    }, err => {
        console.log(err);
    });
});
app.post('/charts/add', (req, res) => {
    const charts = req.body.charts;
    db.addCharts(charts, ids => {
        console.log('Added charts: ', ids);
        res.send({
            added: ids,
        });
    }, err => {
        console.log(err);
    });
});
app.post('/charts/update', (req, res) => {
    const charts = req.body.charts;
    const ids = charts.map(c => c.chart_id);
    db.updateCharts(charts, () => {
        console.log('Updated charts: ', ids);
        res.send({
            updated: ids,
        });
    }, err => {
        console.log(err);
    });
});
app.post('/pairs/add', (req, res) => {
    const pairs = req.body.pairs;
    db.addPairs(pairs, ids => {
        console.log('Updated pairs: ', ids);
        res.send({
            updated: ids,
        });
    }, err => {
        console.log(err);
    });
});
app.post('/pairs/update', (req, res) => {
    const pairs = req.body.pairs;
    const ids = pairs.map(p => p.pair_id);
    db.updatePairs(pairs, () => {
        console.log('Updated pairs: ', ids);
        res.send({
            updated: ids,
        });
    }, err => {
        console.log(err);
    });
});
app.get('/pairs/next-unlabeled/:num', (req, res) => {
    const { num } = req.params;
    db.getNextUnlabeledPair(num, rows => {
        const ids = rows.reduce((set, curr) => {
            set.add(curr.pair_id);
            return set;
        }, new Set());
        console.log(ids);
        db.getPairs(pairs => {
            const unlabeled = pairs.filter(p => ids.has(p.pair_id));
            res.send(unlabeled);
        }, err => {
            console.log(err);
        });
    }, err => {
        console.log(err);
    });
});
app.listen(port, () => console.log(`Listening on port ${port}.`));
//# sourceMappingURL=server.js.map