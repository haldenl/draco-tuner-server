"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3 = require("sqlite3");
const chart_1 = require("./model/chart");
const pairs_1 = require("./model/pairs");
sqlite3.verbose();
class DracoDB {
    constructor(filename) {
        this.ready = false;
        this.db = new sqlite3.Database(filename, err => {
            if (err) {
                throw new Error(`Unable to open database ${filename}`);
            }
            this.ready = true;
        });
    }
    numCharts(onSuccess, onFailure) {
        this.readyCheck();
        this.db.get('SELECT COUNT(*) as count FROM charts', (err, row) => {
            if (err) {
                onFailure(err);
            }
            else {
                onSuccess(row);
            }
        });
    }
    numPairs(onSuccess, onFailure) {
        this.readyCheck();
        this.db.get('SELECT COUNT(*) as count FROM pairs', (err, row) => {
            if (err) {
                onFailure(err);
            }
            else {
                onSuccess(row);
            }
        });
    }
    getCharts(onSuccess, onFailure) {
        this.readyCheck();
        this.db.all('SELECT * FROM charts', (err, rows) => {
            if (err) {
                onFailure(err);
            }
            else {
                onSuccess(rows);
            }
        });
    }
    getPairs(onSuccess, onFailure) {
        this.readyCheck();
        this.db.all(`SELECT p.pair_id, p.left_chart_id, p.right_chart_id, p.comparator,
c1.vegalite as vegalite1, c1.draco as draco1, c1.valid as valid1,
c2.vegalite as vegalite2, c2.draco as draco2, c2.valid as valid2
FROM pairs as p, charts as c1, charts as c2
WHERE p.left_chart_id = c1.chart_id AND p.right_chart_id = c2.chart_id`, (err, rows) => {
            if (err) {
                onFailure(err);
            }
            else {
                const pairs = rows.map(row => pairs_1.Pair.getFilledPairObjectFromDb(row));
                onSuccess(pairs);
            }
        });
    }
    addCharts(charts, onSuccess, onFailure) {
        this.readyCheck();
        const placeholders = charts.map((_) => '(?, ?, ?)');
        const values = charts
            .map(c => chart_1.Chart.getDbArgumentsFromObject(c))
            .reduce((list, args) => {
            return [...list, ...args];
        }, []);
        this.db.run(`INSERT INTO charts (
vegalite, draco, valid
) VALUES ` + placeholders, values, err => {
            if (err) {
                onFailure(err);
            }
            else {
                this.db.all(`SELECT chart_id FROM charts ORDER BY chart_id DESC LIMIT ${charts.length}`, (err, rows) => {
                    if (err) {
                        onFailure(err);
                    }
                    else {
                        onSuccess(rows);
                    }
                });
            }
        });
    }
    updateCharts(charts, onSuccess, onFailure) {
        this.readyCheck();
        const queries = charts.map(c => {
            return `UPDATE charts SET vegalite = "${JSON.stringify(c.vegalite)}", draco = "${JSON.stringify(c.draco)}", valid = ${c.valid ? 1 : 0} WHERE chart_id = ${c.chart_id};`;
        });
        const query = queries.join('\n');
        this.db.run(query, [], err => {
            if (err) {
                onFailure(err);
            }
            else {
                onSuccess();
            }
        });
    }
    addPairs(pairs, onSuccess, onFailure) {
        this.readyCheck();
        const placeholders = pairs.map((_) => '(?, ?, ?)');
        const values = pairs
            .map(p => pairs_1.Pair.getDbArgumentsFromObject(p))
            .reduce((list, args) => {
            return [...list, ...args];
        }, []);
        this.db.run(`INSERT INTO pairs (
  left_chart_id, right_chart_id, comparator
  ) VALUES ` + placeholders, values, err => {
            if (err) {
                onFailure(err);
            }
            else {
                this.db.all(`SELECT pair_id FROM pairs ORDER BY pair_id DESC LIMIT ${pairs.length}`, (err, rows) => {
                    if (err) {
                        onFailure(err);
                    }
                    else {
                        onSuccess(rows);
                    }
                });
            }
        });
    }
    updatePairs(pairs, onSuccess, onFailure) {
        this.readyCheck();
        const queries = pairs.map(p => {
            return `UPDATE pairs SET left_chart_id = ${JSON.stringify(p.left_chart_id)}, right_chart_id = ${JSON.stringify(p.right_chart_id)}, comparator = "${p.comparator}" WHERE pair_id = ${p.pair_id};`;
        });
        const query = queries.join('\n');
        this.db.run(query, [], err => {
            if (err) {
                onFailure(err);
            }
            else {
                onSuccess();
            }
        });
    }
    getNextUnlabeledPair(num, onSuccess, onFailure) {
        this.readyCheck();
        this.db.all(`SELECT pair_id FROM pairs WHERE comparator IS NULL ORDER BY pair_id LIMIT ${num}`, (err, rows) => {
            if (err) {
                onFailure(err);
            }
            else {
                onSuccess(rows);
            }
        });
    }
    readyCheck() {
        if (!this.ready) {
            throw new Error('Database not ready');
        }
    }
}
exports.default = DracoDB;
//# sourceMappingURL=db.js.map