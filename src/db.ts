import * as fs from 'fs';
import * as sqlite3 from 'sqlite3';
import { Chart, ChartObject } from './model/chart';
import { Pair, PairObject } from './model/pairs';

sqlite3.verbose();

export default class DracoDB {
  private db: sqlite3.Database;
  private ready: boolean;

  constructor(filename: string) {
    this.ready = false;
    this.db = new sqlite3.Database(filename, err => {
      if (err) {
        throw new Error(`Unable to open database ${filename}`);
      }

      this.ready = true;
    });
  }

  writePairLabels(path: string, onSuccess: () => void, onFailure: (err: any) => void) {
    this.readyCheck();

    this.getPairs(rows => {
      const labels = rows.reduce((dict, pair) => {
        if (pair.comparator) {
          dict[pair.pair_id] = pair.comparator;
        }

        return dict;
      }, {});

      fs.writeFile(path, JSON.stringify(labels), (err: any) => {
        if (err) {
          onFailure(err);
        } else {
          onSuccess();
        }
      });
    }, onFailure);
  }

  numCharts(onSuccess: (rows: any) => void, onFailure: (err: any) => void) {
    this.readyCheck();

    this.db.get('SELECT COUNT(*) as count FROM charts', (err, row) => {
      if (err) {
        onFailure(err);
      } else {
        onSuccess(row);
      }
    });
  }

  numPairs(onSuccess: (rows: any) => void, onFailure: (err: any) => void) {
    this.readyCheck();

    this.db.get('SELECT COUNT(*) as count FROM pairs', (err, row) => {
      if (err) {
        onFailure(err);
      } else {
        onSuccess(row);
      }
    });
  }

  getCharts(onSuccess: (rows: any) => void, onFailure: (err: any) => void) {
    this.readyCheck();

    this.db.all('SELECT * FROM charts', (err, rows) => {
      if (err) {
        onFailure(err);
      } else {
        onSuccess(rows);
      }
    });
  }

  getPairs(onSuccess: (rows: any) => void, onFailure: (err: any) => void) {
    this.readyCheck();

    this.db.all(
      `SELECT p.pair_id, p.left_chart_id, p.right_chart_id, p.comparator,
c1.vegalite as vegalite1, c1.draco as draco1, c1.valid as valid1,
c2.vegalite as vegalite2, c2.draco as draco2, c2.valid as valid2
FROM pairs as p, charts as c1, charts as c2
WHERE p.left_chart_id = c1.chart_id AND p.right_chart_id = c2.chart_id`,
      (err, rows) => {
        if (err) {
          onFailure(err);
        } else {
          const pairs = rows.map(row => Pair.getFilledPairObjectFromDb(row));
          onSuccess(pairs);
        }
      }
    );
  }

  addCharts(charts: ChartObject[], onSuccess: (rows) => void, onFailure: (err: any) => void) {
    this.readyCheck();

    const placeholders = charts.map((_: any) => '(?, ?, ?)');
    const values = charts
      .map(c => Chart.getDbArgumentsFromObject(c))
      .reduce((list: any[], args) => {
        return [...list, ...args];
      }, []);

    this.db.run(
      `INSERT INTO charts (
vegalite, draco, valid
) VALUES ` + placeholders,
      values,
      err => {
        if (err) {
          onFailure(err);
        } else {
          this.db.all(`SELECT chart_id FROM charts ORDER BY chart_id DESC LIMIT ${charts.length}`, (err, rows) => {
            if (err) {
              onFailure(err);
            } else {
              onSuccess(rows);
            }
          });
        }
      }
    );
  }

  updateCharts(charts: ChartObject[], onSuccess: () => void, onFailure: (err: any) => void) {
    this.readyCheck();

    const queries = charts.map(c => {
      return `UPDATE charts SET vegalite = "${JSON.stringify(c.vegalite)}", draco = "${JSON.stringify(
        c.draco
      )}", valid = ${c.valid ? 1 : 0} WHERE chart_id = ${c.chart_id};`;
    });

    const query = queries.join('\n');

    this.db.run(query, [], err => {
      if (err) {
        onFailure(err);
      } else {
        onSuccess();
      }
    });
  }

  addPairs(pairs: PairObject[], onSuccess: (rows) => void, onFailure: (err: any) => void) {
    this.readyCheck();

    const placeholders = pairs.map((_: any) => '(?, ?, ?)');
    const values = pairs
      .map(p => Pair.getDbArgumentsFromObject(p))
      .reduce((list: any[], args) => {
        return [...list, ...args];
      }, []);

    this.db.run(
      `INSERT INTO pairs (
  left_chart_id, right_chart_id, comparator
  ) VALUES ` + placeholders,
      values,
      err => {
        if (err) {
          onFailure(err);
        } else {
          this.db.all(`SELECT pair_id FROM pairs ORDER BY pair_id DESC LIMIT ${pairs.length}`, (err, rows) => {
            if (err) {
              onFailure(err);
            } else {
              onSuccess(rows);
            }
          });
        }
      }
    );
  }

  updatePairs(pairs: PairObject[], onSuccess: () => void, onFailure: (err: any) => void) {
    this.readyCheck();

    const queries = pairs.map(p => {
      return `UPDATE pairs SET left_chart_id = ${JSON.stringify(p.left_chart_id)}, right_chart_id = ${JSON.stringify(
        p.right_chart_id
      )}, comparator = "${p.comparator}" WHERE pair_id = ${p.pair_id};`;
    });

    const query = queries.join('\n');

    this.db.run(query, [], err => {
      if (err) {
        onFailure(err);
      } else {
        onSuccess();
      }
    });
  }

  getNextUnlabeledPair(num: number, onSuccess: (rows) => void, onFailure: (err: any) => void) {
    this.readyCheck();

    this.db.all(`SELECT pair_id FROM pairs WHERE comparator IS NULL ORDER BY pair_id LIMIT ${num}`, (err, rows) => {
      if (err) {
        onFailure(err);
      } else {
        onSuccess(rows);
      }
    });
  }

  private readyCheck(): void {
    if (!this.ready) {
      throw new Error('Database not ready');
    }
  }
}
