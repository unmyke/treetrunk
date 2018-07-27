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
  ADD_CLOSE_RECORD: 'addCloseDay',
  DELETE_CLOSE_RECORD: 'deleteCloseDay',
  UPDATE_CLOSE_RECORD: 'updateCloseDay',
};

const stateTransitionFunctions = {
  deleteRecord: function() {
    switch (true) {
      case this._records.length === 1:
        return states.NEW;

      case this.records.length === 1:
        return states.CLOSED;

      default:
        return states.STARTED;
    }
  },
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

    transitions: [
      {
        name: transitions.ADD_RECORD,
        from: [states.NEW, states.STARTED, states.CLOSED],
        to: states.STARTED,
      },
      {
        name: transitions.DELETE_RECORD,
        from: states.STARTED,
        to: stateTransitionFunctions.deleteRecord,
      },
      {
        name: transitions.UPDATE_RECORD,
        from: states.STARTED,
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
            throw errors.diaryNotStarted();

          case transitions.UPDATE_RECORD:
            throw errors.diaryNotStarted();

          case transitions.ADD_CLOSE_RECORD:
            throw errors.diaryNotStarted();

          case transitions.DELETE_CLOSE_RECORD:
            throw errors.diaryNotClosed();

          case transitions.UPDATE_CLOSE_RECORD:
            throw errors.diaryNotClosed();

          default:
            throw errors.transitionNotAllowed();
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

  constructor({ closeValue, RecordClass, records = [], closeDays = [] }) {
    super();

    this.closeValue = closeValue;
    this.RecordClass = RecordClass;

    this._records = records;
    this._closeDays = closeDays;

    this._runFSM();
  }

  // getters

  //   public metods
  get records() {
    return this.getRecordsAt();
  }

  get allRecords() {
    return [
      ...this._records,
      ...this._closeDays.map(
        (day) =>
          new this.RecordClass({
            [RecordClass.valuePropName]: this.closeValue,
            day,
          })
      ),
    ].sort(getDayComparator('asc'));
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
    return this.is(states.STARTED);
  }

  get closeDay() {
    return this.getCloseDayAt();
  }

  get isClosed() {
    return this.is(states.CLOSED);
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

    if (this._isCloseDay(record)) {
      return true;
    }

    return false;
  }

  _getPrevCloseDayAt(day = new Day()) {
    const closeRecords = this._getCloseDays();

    return closeRecords
      .sort(getDayComparator('asc'))
      .reduce((closeDay, { day: currentCloseDay }) => {
        return currentCloseDay < day ? currentCloseDay : closeDay;
      }, undefined);
  }

  _getNextCloseDayAt(day = new Day()) {
    const closeRecords = this._getCloseDays();

    return closeRecords
      .sort(getDayComparator('desc'))
      .reduce((closeDay, { day: currentCloseDay }) => {
        return currentCloseDay > day ? currentCloseDay : closeDay;
      }, undefined);
  }

  _getCloseDays() {
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

  _isCloseDay(day) {
    if (day === undefined) {
      return false;
    }

    return this._closeDays.includes(day);
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

  _deleteRecord({ day }) {
    this._records = this._records.filter(
      ({ day: currentDay }) => !currentDay.equals(day)
    );
  }

  _updateRecord({ day, newRecord }) {
    this._deleteRecord({ day });
    this._addRecord({ record: newRecord });
  }

  _addCloseDay({ day }) {
    this._closeDays = [..._closeDays, day];
  }

  _deleteCloseDay() {
    const lastCloseDay = Math.max(this._closeDays);

    this._closeDays = this._closeDays.filter(
      (day) => !day.equals(lastCloseDay)
    );
  }

  _updateCloseDay({ day }) {
    this._deleteCloseDay();
    this._addCloseDay({ day });
  }
}

applyFSM(Diary);
