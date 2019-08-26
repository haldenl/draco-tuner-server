import { Chart } from './chart';

export interface PairObject {
  pair_id?: number;
  left_chart_id: number;
  right_chart_id: number;
  comparator: string;
}

export interface FilledPairObject {
  pair_id?: number;
  left: Chart;
  right: Chart;
  comparator: string;
}

export class Pair {
  static getDbArgumentsFromObject(pair: PairObject) {
    return [pair.left_chart_id, pair.right_chart_id, pair.comparator];
  }

  static getFilledPairObjectFromDb(row: any) {
    return {
      pair_id: row.pair_id,
      left: {
        chart_id: row.left_chart_id,
        vegalite: JSON.parse(row.vegalite1),
        draco: JSON.parse(row.draco1),
        valid: row.valid1,
      },
      right: {
        chart_id: row.right_chart_id,
        vegalite: JSON.parse(row.vegalite2),
        draco: JSON.parse(row.draco2),
        valid: row.valid2,
      },
      comparator: row.comparator,
    };
  }
}
