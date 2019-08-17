import { Witness } from 'ndraco-core';
import { TopLevelUnitSpec } from 'vega-lite/src/spec/unit';

export interface ChartObject {
  chart_id?: number;
  vegalite: TopLevelUnitSpec;
  draco: Witness;
  valid: boolean;
}

export class Chart {
  static getDbArgumentsFromObject(chart: ChartObject): any[] {
    if (chart.chart_id !== undefined) {
      return [JSON.stringify(chart.vegalite), JSON.stringify(chart.draco), chart.valid ? 1 : 0, chart.chart_id];
    }

    return [JSON.stringify(chart.vegalite), JSON.stringify(chart.draco), chart.valid ? 1 : 0];
  }
}
