import { Day, Diary } from '../../commonTypes';
import { PieceRate } from './PieceRate';

export class PieceRates extends Diary {
  constructor() {
    super({ RecordClass: PieceRate });
  }

  get pieceRates() {
    return this._records;
  }

  get hasPieceRates() {
    return this._hasRecords;
  }

  get pieceRateValue() {
    return this._recordValue;
  }

  get pieceRateValues() {
    return this._recordValues;
  }

  getPieceRatesAt(day = new Day(), options = {}) {
    return this._getRecordsAt(day);
  }

  hasPieceRatesAt(day = new Day()) {
    return this._hasRecordsAt(day);
  }

  getPieceRateValueAt(day = new Day()) {
    return this._getRecordValueAt(day);
  }

  getPieceRateValuesAt(day = new Day(), options = {}) {
    return this._getRecordValuesAt(day, options);
  }

  setPieceRates(pieceRates) {
    return this._setRecords(pieceRates);
  }

  addPieceRate(pieceRate) {
    return this._addRecord(pieceRate);
  }

  deletePieceRate(pieceRate) {
    return this._deleteRecord(pieceRate);
  }

  editPieceRate(pieceRate, newPieceRate) {
    return this._editRecord(pieceRate, newPieceRate);
  }
}
