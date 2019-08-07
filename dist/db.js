"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3 = require("sqlite3");
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
        this.db.get('SELECT COUNT(*) FROM charts', (err, row) => {
            if (err) {
                onFailure(err);
            }
            else {
                onSuccess(row);
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