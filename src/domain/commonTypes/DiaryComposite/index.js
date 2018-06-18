import { Diary } from '../Diary';
import { makeError, errors } from '../../errors';

export class DiaryComposite {
  constructor({ closeValue, RecordClass, mapper }) {
    this._diary = new Diary({ closeValue, RecordClass });
    this.mapper = mapper;
  }

  // getters

  get records() {
    return this._diary.records;
  }

  get hasRecords() {
    return this._diary.hasRecords;
  }

  get recordValue() {
    return this._diary.recordValue;
  }

  get recordValues() {
    return this._diary.recordValues;
  }

  get startDay() {
    return this._diary.startDay;
  }

  get isStarted() {
    return this._diary.isStarted;
  }

  get closedDay() {
    return this._diary.closedDay;
  }

  get isClosed() {
    return this._diary.isClosed;
  }

  // public

  getRecordsAt(day = new Day(), options = {}) {
    return this._diary.getRecordsAt(day);
  }

  hasRecordsAt(day = new Day()) {
    return this._diary.hasRecordsAt(day);
  }

  getRecordValueAt(day = new Day()) {
    return this._diary.getRecordValueAt(day);
  }

  getRecordValuesAt(day = new Day(), options = {}) {
    return this._diary.getRecordValuesAt(day, options);
  }

  setRecords(recordEntries) {
    const records = recordEntries.map(
      ({ value, day }) => new this._diary.RecordClass({ value, day })
    );

    return this._emit('setRecords', {
      newRecords: records,
    });
  }

  addRecord(value, day = new Day()) {
    const record = new this._diary.RecordClass({ value, day });

    return this._emit('addRecord', {
      record: record,
    });
  }

  deleteRecord(value, day = new Day()) {
    const record = new this._diary.RecordClass({ value, day });

    return this._emit('deleteRecord', {
      record: record,
    });
  }

  updateRecord(value, day, newValue, newDay) {
    const record = new this._diary.RecordClass({ value, day });
    const newRecord = new this._diary.RecordClass({
      value: newValue,
      day: newDay,
    });

    return this._emit('updateRecord', {
      record: record,
      newRecord: newRecord,
    });
  }

  map(fn) {
    return this._diary.map(fn);
  }

  filter(fn) {
    return this._diary.map(fn);
  }

  reduce(fn) {
    return this._diary.map(fn);
  }

  // private

  _emit(operation, args) {
    const { done, error } = this._diary[operation](args);

    if (!done) {
      const argNames = Object.keys(args);

      throw makeError(
        argNames.reduce((details, argName) => {
          if (error[argName] !== undefined && error[argName].length !== 0) {
            return {
              ...details,
              [this.mapper[argName]]: error[argName],
            };
          }

          return details;
        }, {})
      );
    }

    return done;
  }
}
