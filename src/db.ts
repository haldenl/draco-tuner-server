import * as sqlite3 from 'sqlite3';

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

  numCharts(onSuccess: (rows: any) => void, onFailure: (err: any) => void) {
    this.readyCheck();

    this.db.get('SELECT COUNT(*) FROM charts', (err, row) => {
      if (err) {
        onFailure(err);
      } else {
        onSuccess(row);
      }
    });
  }

  private readyCheck(): void {
    if (!this.ready) {
      throw new Error('Database not ready');
    }
  }
}
