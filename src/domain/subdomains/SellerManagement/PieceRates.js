import { Day, DiaryComposite } from '../../commonTypes';
import { PieceRate } from './PieceRate';

const diaryArgsMap = {
  record: 'pieceRate',
  newRecord: 'newPieceRate',
  newRecords: 'newPieceRates',
};

export class PieceRates extends DiaryComposite {
  constructor() {
    super({ RecordClass: PieceRate, mapper: diaryArgsMap });
  }

  get pieceRates() {
    return this._diary.records;
  }

  get hasPieceRates() {
    return this._diary.hasRecords;
  }

  get pieceRateValue() {
    return this._diary.recordValue;
  }

  getPieceRatesAt(day = new Day(), options = {}) {
    return this._diary.getRecordsAt(day);
  }

  hasPieceRatesAt(day = new Day()) {
    return this._diary.hasRecordsAt(day);
  }

  getPieceRateValueAt(day = new Day()) {
    return this._diary.getRecordValueAt(day);
  }

  getPieceRateValuesAt(day = new Day(), options = {}) {
    return this._diary.getRecordValuesAt(day, options);
  }

  setPieceRates(pieceRateEntries) {
    const pieceRates = pieceRateEntries.map(
      ({ value, day }) => new PieceRate({ value, day })
    );

    return this._emit('setRecords', {
      newRecords: pieceRates,
    });
  }

  addPieceRate(value, day = new Day()) {
    const pieceRate = new PieceRate({ value, day });

    return this._emit('addRecord', {
      record: pieceRate,
    });
  }

  deletePieceRate(value, day = new Day()) {
    const pieceRate = new PieceRate({ value, day });

    return this._emit('deleteRecord', {
      record: pieceRate,
    });
  }

  updatePieceRate(value, day, newValue, newDay) {
    const pieceRate = new PieceRate({ value, day });
    const newPieceRate = new PieceRate({
      value: newValue,
      day: newDay,
    });

    return this._emit('updateRecord', {
      record: pieceRate,
      newRecord: newPieceRate,
    });
  }
}
