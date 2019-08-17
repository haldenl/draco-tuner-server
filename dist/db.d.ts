import { ChartObject } from './model/chart';
import { PairObject } from './model/pairs';
export default class DracoDB {
    private db;
    private ready;
    constructor(filename: string);
    numCharts(onSuccess: (rows: any) => void, onFailure: (err: any) => void): void;
    numPairs(onSuccess: (rows: any) => void, onFailure: (err: any) => void): void;
    getCharts(onSuccess: (rows: any) => void, onFailure: (err: any) => void): void;
    getPairs(onSuccess: (rows: any) => void, onFailure: (err: any) => void): void;
    addCharts(charts: ChartObject[], onSuccess: () => void, onFailure: (err: any) => void): void;
    updateCharts(charts: ChartObject[], onSuccess: () => void, onFailure: (err: any) => void): void;
    addPairs(pairs: PairObject[], onSuccess: () => void, onFailure: (err: any) => void): void;
    updatePairs(pairs: PairObject[], onSuccess: () => void, onFailure: (err: any) => void): void;
    private readyCheck;
}
