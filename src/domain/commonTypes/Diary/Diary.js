import { lowerFirst, lowerCase, upperFirst, upperCase } from 'lodash';
import { errors } from '../../errors';

import { applyFSM, getDayComparator } from '../../_lib/BaseMethods';
import { BaseClass, BaseValue } from '../../_lib';
import { Day } from '../Day';

export class Diary extends BaseClass {
  // states
  static states = {
    NEW: 'new',
    STARTED: 'started',
    CLOSED: 'closed',
  };

  // FSM
  static fsm = {
    // init: 'idle',

    // transitions: [
    //   { name: 'operate', from: 'idle', to: 'validation' },
    //   {
    //     name: 'process',
    //     from: 'validation',
    //     to: 'result',
    //   },
    //   { name: 'reset', from: 'result', to: 'idle' },
    // ],

    init: 'new',

    transitions: [
      {
        name: 'addRecord',
        from: [Diary.states.NEW, Diary.states.STARTED, Diary.states.CLOSED],
        to: Diary.states.STARTED,
      },
      {
        name: 'deleteRecord',
        from: Diary.states.STARTED,
        to: Diary.deleteRecordTrasitionCondition,
      },
    ],

    methods: {
      onBeforeAddRecord(lifecycle, operation) {
        this.operation = operation;

        this._validation(operation.args);
      },

      onResult() {
        const primitiveOperationName = `_${this.operation.name}`;

        this[primitiveOperationName](this.operation.args);
      },
    },
  };

  //
  static deleteRecordTrasitionCondition() {
    switch (true) {
      case this._records.length === 0:
        return 'new';

      case this.records.length === 0:
        return 'closed';

      default:
        return 'stared';
    }
  }

  constructor({ closeValue, RecordClass }) {
    super();

    this.closeValue = closeValue;
    this.RecordClass = RecordClass;

    this._records = [];

    applyFSM(this.constructor);
    this._fsm();
  }

  // getters

  //   public metods
  get records() {
    return this.getRecordsAt();
  }

  get hasRecords() {
    return this.hasRecordsAt();
  }

  get recordValue() {
    return this.getRecordValueAt();
  }

  get recordDay() {
    return this.getRecordDayAt();
  }

  get recordValues() {
    return this.getRecordValuesAt();
  }

  get startDay() {
    return this.getStartDayAt();
  }

  get isStarted() {
    return this.isStartedAt();
  }

  get closeDay() {
    return this.getCloseDayAt();
  }

  get isClosed() {
    return this.isClosedAt();
  }

  getRecordsAt(day = new Day(), options = {}) {
    return this._getRecordsContainsDay(day, options).filter(
      ({ day: currentDay }) => currentDay <= day
    );
  }

  hasRecordsAt(day = new Day()) {
    return this.getRecordsAt(day).length !== 0;
  }

  getRecordValueAt(day = new Day()) {
    const record = this._getRecordAt(day);

    return record !== undefined ? record.value : undefined;
  }

  getRecordValuesAt(day = new Day(), options = {}) {
    return this.getRecordsAt(day, options).map(({ value }) => value);
  }

  getRecordDayAt(day = new Day()) {
    const record = this._getRecordAt(day);

    return record !== undefined ? record.day : undefined;
  }

  getStartDayAt(day = new Day(), options = {}) {
    const records = this.getRecordsAt(day, options);

    if (records.length === 0) {
      return;
    }

    return records[0].day;
  }

  isStartedAt(day = new Day()) {
    return !!this.getStartDayAt(day);
  }

  getCloseDayAt(day = new Day()) {
    if (this._isCloseDay(day)) {
      return day;
    }

    return this._getRecordAt(day) === undefined
      ? this._getPrevCloseDayAt(day)
      : undefined;
  }

  isClosedAt(day = new Day()) {
    return !!this.getCloseDayAt(day);
  }

  //   private metods
  _hasRecordOn(day = new Day(), options = {}) {
    const persistedRecord = this._getRecordOn(day, options);
    return !!persistedRecord;
  }

  _hasRecord(record, options = {}) {
    if (record === undefined) {
      return;
    }

    const persistedRecord = this._getRecordOn(record.day, options);
    return persistedRecord !== undefined && record.equals(persistedRecord);
  }

  _getRecordAt(day = new Day(), options = {}) {
    const recordsAt = this.getRecordsAt(day, options);

    return recordsAt[recordsAt.length - 1];
  }

  _getPrevRecord(record, options = {}) {
    if (record === undefined) {
      return;
    }

    return this._getPrevRecordAt(record.day, options);
  }

  _getNextRecord(record, options = {}) {
    if (record === undefined) {
      return;
    }

    return this._getNextRecordAt(record.day, options);
  }

  _getPrevRecordAt(day = new Day(), options = {}) {
    const recordsBeforeDay = this._getRecordsBeforeDay(day, options);

    return recordsBeforeDay[recordsBeforeDay.length - 1];
  }

  _getNextRecordAt(day = new Day(), options = {}) {
    const recordsAfterDay = this._getRecordsAfterDay(day, options);

    return recordsAfterDay[0];
  }

  _getRecordsBeforeDay(day = new Day(), options = {}) {
    return this._getRecordsContainsDay(day.prev(), options).filter(
      ({ day: currentDay }) => currentDay < day
    );
  }

  _getRecordsAfterDay(day = new Day(), options = {}) {
    return this._getRecordsContainsDay(day.next(), options).filter(
      ({ day: currentDay }) => currentDay > day
    );
  }

  _hasRecordsBeforeDay(day = new Day(), options = {}) {
    return this._getRecordsBeforeDay(day, options).length !== 0;
  }

  _hasRecordsAfterDay(day = new Day(), options = {}) {
    return this._getRecordsAfterDay(day, options).length !== 0;
  }

  _getRecordsContainsDay(day = new Day(), options = {}) {
    if (this._records.length === 0) {
      return [];
    }

    const prevCloseDay = this._getPrevCloseDayAt(day);
    const nextCloseDay = this._getNextCloseDayAt(day);

    return this._records.sort(getDayComparator('asc')).filter((record) => {
      return (
        !this._isCloseDay(day) &&
        (prevCloseDay === undefined || record.day > prevCloseDay) &&
        (nextCloseDay === undefined || record.day < nextCloseDay) &&
        (options.excludeRecords === undefined ||
          !this._isExcludedRecord(record, options.excludeRecords))
      );
    });
  }

  _isCloseDay(day = new Day()) {
    const record = this._getRecordOn(day);

    if (this._isCloseRecord(record)) {
      return true;
    }

    return false;
  }

  _getPrevCloseDayAt(day = new Day()) {
    const closeRecords = this._getCloseRecords();

    return closeRecords
      .sort(getDayComparator('asc'))
      .reduce((closeDay, { day: currentCloseDay }) => {
        return currentCloseDay < day ? currentCloseDay : closeDay;
      }, undefined);
  }

  _getNextCloseDayAt(day = new Day()) {
    const closeRecords = this._getCloseRecords();

    return closeRecords
      .sort(getDayComparator('desc'))
      .reduce((closeDay, { day: currentCloseDay }) => {
        return currentCloseDay > day ? currentCloseDay : closeDay;
      }, undefined);
  }

  _getCloseRecords() {
    if (this.closeValue === undefined) {
      return [];
    }

    return this._records.filter(({ value }) =>
      this._compareValues(value, this.closeValue)
    );
  }

  _getRecordOn(day = new Day(), options = {}) {
    return this._records.find((record) => {
      // console.log(record);
      // console.log(options);

      return (
        record.day.equals(day) &&
        !(
          options.excludeRecords !== undefined &&
          options.excludeRecords.length !== 0 &&
          options.excludeRecords.reduce(
            (isEqual, excludeRecord) => isEqual || record.equal(excludeRecord),
            true
          )
        )
      );
    });
  }

  _isCloseRecord(record) {
    if (record === undefined) {
      return false;
    }

    return this._compareRecordValues(record.value, this.closeValue);
  }

  _isStartRecord(record) {
    if (record === undefined) {
      return false;
    }

    const startRecord = this.getStartDayAt(record.day);
    if (startRecord === undefined) {
      return false;
    }

    return startRecord.equals(record);
  }

  //  utils
  _compareRecordValues(record1, record2) {
    return (
      record1 !== undefined &&
      record2 !== undefined &&
      this._compareValues(record1.value, record2.value)
    );
  }

  _compareValues(value1, value2) {
    if (value1 instanceof BaseValue) {
      return value1.equals(value2);
    }

    return value1 === value2;
  }

  // operations

  //  public methods
  map(fn) {
    return this.records.map(fn);
  }

  reduce(fn) {
    return this.records.reduce(fn);
  }

  filter(fn) {
    return this.records.filter(fn);
  }

  //  private methods

  //    operations
  setRecords({ newRecords } = { newRecords: [] }) {
    return this._emit({ name: 'set', args: { newRecords } });
  }

  addRecord({ record }) {
    return this._emit({ name: 'add', args: { record } });
  }

  deleteRecord({ record }) {
    return this._emit({ name: 'delete', args: { record } });
  }

  updateRecord({ record, newRecord }) {
    return this._emit({ name: 'update', args: { record, newRecord } });
  }

  addCloseRecord(day) {
    return this._emit({ name: 'addClose', args: { day } });
  }

  deleteCloseRecord() {
    return this._emit({ name: 'deleteClose' });
  }

  updateCloseRecord() {
    return this._emit({ name: 'updateClose', args: { day } });
  }

  //    operation runner
  _emit(operation) {
    this.operate(operation);
    const result = this.process();
    this.reset();
    return result;
  }

  //    primitive oparations
  _set({ newRecords }) {
    this._records = [...newRecords];
  }

  _add({ record }) {
    this._records = [...this._records, record];
  }

  _delete({ record }) {
    this._records = this._records.filter(
      (currentRecord) => !record.equals(currentRecord)
    );
  }

  _update({ record, newRecord }) {
    this._delete({ record });
    this._add({ record: newRecord });
  }

  _addClose({ day }) {
    const closeRecord = new this.RecordClass({
      value: this.closeValue,
      day,
    });

    this._add({ record: closeRecord });
  }

  _deleteClose() {
    this._records = this._records.slice(0, -1);
  }

  _updateClose({ day }) {
    this._deleteClose();
    this._addClose({ day });
  }
}
