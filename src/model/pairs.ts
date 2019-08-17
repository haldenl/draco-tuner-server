export interface PairObject {
  pair_id?: number;
  left_chart_id: number;
  right_chart_id: number;
  comparator: string;
}

export class Pair {
  static getDbArgumentsFromObject(pair: PairObject) {
    return [pair.left_chart_id, pair.right_chart_id, pair.comparator];
  }
}
