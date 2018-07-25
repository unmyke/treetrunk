import { applyFSM, getDayComparator } from '../../_lib/BaseMethods';
import { errors } from '../../errors';
import { BaseClass, BaseValue } from '../../_lib';
import { Day } from '../Day';
import { OperationRuleSet } from './OperationRuleSet';

const states = {
  NEW: 'new',
  STARTED: 'started',
  CLOSED: 'closed',
};

const transitions = {
  ADD_RECORD: 'addRecord',
  DELETE_RECORD: 'deleteRecord',
  UPDATE_RECORD: 'updateRecord',
  ADD_CLOSE_RECORD: 'addCloseRecord',
  DELETE_CLOSE_RECORD: 'deleteCloseRecord',
  UPDATE_CLOSE_RECORD: 'updateCloseRecord',
};

export class Diary extends BaseClass {
  // FSM

  static fsm = {
    getRawState: function(diary) {
      switch (true) {
        case diary._records.length === 0:
          return states.NEW;

        case diary.records.length === 0:
          return states.CLOSED;

        default:
          return states.STARTED;
      }
    },

    init: states.INITIALIZED,
    transitions: [
      {
        name: transitions.ADD_RECORD,
        from: [states.NEW, states.STARTED, states.CLOSED],
        to: states.STARTED,
      },
      {
        name: transitions.DELETE_RECORD,
        from: [states.STARTED, states.CLOSED],
        to: Diary.getRawState,
      },
      {
        name: transitions.UPDATE_RECORD,
        from: [states.STARTED, states.CLOSED],
        to: states.STARTED,
      },
      {
        name: transitions.ADD_CLOSE_RECORD,
        from: states.STARTED,
        to: states.CLOSED,
      },
      {
        name: transitions.DELETE_CLOSE_RECORD,
        from: states.CLOSED,
        to: states.STARTED,
      },
      {
        name: transitions.UPDATE_CLOSE_RECORD,
        from: states.CLOSED,
        to: states.CLOSED,
      },
    ],

    methods: {
      onInvalidTransition(transition, from) {
        switch (transition) {
          case transitions.DELETE_RECORD:
            switch (from) {
              case states.NEW:
                throw errors.recordNotFound();
            }
            break;

          case transitions.UPDATE_RECORD:
            switch (from) {
              case states.NEW:
                throw errors.recordNotFound();
              case states.CLOSED:
                throw errors.diaryClosed();
            }
            break;

          case transitions.ADD_CLOSE_RECORD:
            switch (from) {
              case states.NEW:
              case states.CLOSED:
                throw errors.diaryNotStarted();
            }
            break;

          case transitions.DELETE_CLOSE_RECORD:
            switch (from) {
              case states.NEW:
              case states.STARTED:
                throw errors.diaryNotClosed();
            }
            break;

          case transitions.UPDATE_CLOSE_RECORD:
            switch (from) {
              case states.NEW:
              case states.STARTED:
                throw errors.diaryNotClosed();
            }
            break;

          default:
            break;
        }
      },

      onBeforeTransition({ transition }, args) {
        if (Object.values(transitions).includes(transition)) {
          const operationRuleSet = new OperationRuleSet({
            operatee: this,
            operationName: transition,
          });

          operationRuleSet.check(args);
        }
      },

      onTransition({ transition }, args) {
        if (Object.values(transitions).includes(transition)) {
          this[`_${transition}`](args);
        }
      },
    },
  };

  constructor({ closeValue, RecordClass, records = [] }) {
    super();

    this.closeValue = closeValue;
    this.RecordClass = RecordClass;

    this._records = records;

    this._runFSM();
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

  isDiaryClosedAt(day = new Day()) {
    return !!this._getNextCloseDayAt(day);
  }

  hasRecordOn(day = new Day(), options = {}) {
    const persistedRecord = this._getRecordOn(day, options);

    return !!persistedRecord;
  }

  hasRecord(record, options = {}) {
    if (record === undefined) {
      return;
    }

    const persistedRecord = this._getRecordOn(record.day, options);
    return persistedRecord !== undefined && record.equals(persistedRecord);
  }

  getPrevRecord(record, options = {}) {
    if (record === undefined) {
      return;
    }

    return this.getPrevRecordAt(record.day, options);
  }

  getNextRecord(record, options = {}) {
    if (record === undefined) {
      return;
    }

    return this.getNextRecordAt(record.day, options);
  }

  getPrevRecordAt(day = new Day(), options = {}) {
    const recordsBeforeDay = this._getRecordsBeforeDay(day, options);

    return recordsBeforeDay[recordsBeforeDay.length - 1];
  }

  getNextRecordAt(day = new Day(), options = {}) {
    const recordsAfterDay = this._getRecordsAfterDay(day, options);

    return recordsAfterDay[0];
  }

  hasRecordsBeforeDay(day = new Day(), options = {}) {
    return this._getRecordsBeforeDay(day, options).length !== 0;
  }

  hasRecordsAfterDay(day = new Day(), options = {}) {
    return this._getRecordsAfterDay(day, options).length !== 0;
  }

  //   private metods

  _getRecordAt(day = new Day(), options = {}) {
    const recordsAt = this.getRecordsAt(day, options);

    return recordsAt[recordsAt.length - 1];
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

  _getRecordsContainsDay(day = new Day(), options = {}) {
    if (this._records.length === 0) {
      return [];
    }

    const prevCloseDay = this._getPrevCloseDayAt(day);
    const nextCloseDay = this._getNextCloseDayAt(day);

    const recordsContainsDay = this._records
      .sort(getDayComparator('asc'))
      .filter((record) => {
        return (
          !this._isCloseDay(day) &&
          (prevCloseDay === undefined || record.day > prevCloseDay) &&
          (nextCloseDay === undefined || record.day < nextCloseDay) &&
          (options.excludeRecords === undefined ||
            !this._isExcludedRecord(record, options.excludeRecords))
        );
      });

    return recordsContainsDay;
  }

  _isExcludedRecord(record, recordsToExclude) {
    return (
      recordsToExclude.find((recordToExclude) =>
        record.equals(recordToExclude)
      ) !== undefined
    );
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
      return (
        record.day.equals(day) &&
        (options.excludeRecords === undefined ||
          !this._isExcludedRecord(record, options.excludeRecords))
      );
    });
  }

  _isCloseRecord(record) {
    if (record === undefined) {
      return false;
    }

    return this.compareRecordValues(record.value, this.closeValue);
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
  compareRecordValues(value1, value2) {
    return (
      value1 !== undefined &&
      value2 !== undefined &&
      this._compareValues(value1, value2)
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

  //    primitive oparations
  _addRecord({ record }) {
    this._records = [...this._records, record];
  }

  _deleteRecord({ record }) {
    this._records = this._records.filter(
      (currentRecord) => !record.equals(currentRecord)
    );
  }

  _updateRecord({ record, newRecord }) {
    this._deleteRecord({ record });
    this._addRecord({ record: newRecord });
  }

  _addCloseRecord({ day }) {
    const closeRecord = new this.RecordClass({
      value: this.closeValue,
      day,
    });

    this._addRecord({ record: closeRecord });
  }

  _deleteCloseRecord() {
    this._records = this._records.slice(0, -1);
  }

  _updateCloseRecord({ day }) {
    this._deleteCloseRecord();
    this._addCloseRecord({ day });
  }
}

applyFSM(Diary);
