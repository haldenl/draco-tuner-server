export default class DracoDB {
    private db;
    private ready;
    constructor(filename: string);
    numCharts(onSuccess: (rows: any) => void, onFailure: (err: any) => void): void;
    private readyCheck;
}
