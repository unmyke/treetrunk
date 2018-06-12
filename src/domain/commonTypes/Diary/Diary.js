import { lowerFirst, lowerCase, upperFirst, upperCase } from 'lodash';
import { errors } from '../../errors';

import { applyFSM, getDayComparator } from '../../_lib/BaseMethods';
import { BaseClass, BaseValue } from '../../_lib';
import { Day } from '../Day';

export class Diary extends BaseClass {
  // FSM
  static fsm = {
    init: 'idle',

    transitions: [
      { name: 'operate', from: 'idle', to: 'validation' },
      {
        name: 'process',
        from: 'validation',
        to: Diary.getPostValidationState,
      },
      { name: 'reset', from: ['result', 'error'], to: 'idle' },
    ],

    methods: {
      onValidation(lifecycle, operation) {
        this.operation = { ...operation, error: {} };

        this._validation(operation.args);
      },

      onResult() {
        const primitiveOperationName = `_${this.operation.name}`;

        this[primitiveOperationName](this.operation.args);
        return {
          done: true,
          error: null,
        };
      },

      onError() {
        return {
          done: false,
          error: this.operation.error,
        };
      },
    },
  };

  // state-transition functions
  static getPostValidationState() {
    if (Object.keys(this.operation.error).length === 0) {
      return 'result';
    }

    return 'error';
  }

  constructor({ closeValue, RecordClass }) {
    super();

    this.closeValue = closeValue;
    this.RecordClass = RecordClass;

    this.__records = [];

    applyFSM(this.constructor);
    this._fsm();
  }

  // getters

  //  private metods
  get _records() {
    return this._getRecordsAt();
  }

  get _hasRecords() {
    return this._hasRecordsAt();
  }

  get _recordValue() {
    return this._getRecordValueAt();
  }

  get _recordDay() {
    return this._getRecordDayAt();
  }

  get _recordValues() {
    return this._getRecordValuesAt();
  }

  get _startDay() {
    return this._getStartDayAt();
  }

  get _isStarted() {
    return this._isStartedAt();
  }

  get _closeDay() {
    return this._getCloseDayAt();
  }

  get _isClosed() {
    return this._isClosedAt(day);
  }

  _getRecordsAt(day = new Day(), options = {}) {
    return this._getRecordsContainsDay(day, options).filter(
      ({ day: currentDay }) => currentDay <= day
    );
  }

  _hasRecordsAt(day = new Day()) {
    return this._getRecordsAt(day).length !== 0;
  }

  _getRecordValueAt(day = new Day()) {
    const record = this._getRecordAt(day);

    return record !== undefined ? record.value : undefined;
  }

  _getRecordValuesAt(day = new Day(), options = {}) {
    return this._getRecordsAt(day, options).map(({ value }) => value);
  }

  _getRecordDayAt(day = new Day()) {
    const record = this._getRecordAt(day);

    return record !== undefined ? record.day : undefined;
  }

  _getStartDayAt(day = new Day(), options = {}) {
    const records = this._getRecordsAt(day, options);

    if (records.length === 0) {
      return;
    }

    return records[0].day;
  }

  _isStartedAt(day = new Day()) {
    const startDay = this._getStartDayAt(day);
    return !!startDay;
  }

  _getCloseDayAt(day = new Day()) {
    if (this._isCloseDay(day)) {
      return day;
    }

    return this._getRecordAt(day) === undefined
      ? this._getPrevCloseDayAt(day)
      : undefined;
  }

  _isClosedAt(day = new Day()) {
    return !!this._getCloseDayAt(day);
  }

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
    const recordsAt = this._getRecordsAt(day, options);

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
    return this._getRecordsContainsDay(day.prev()).filter(
      ({ day: currentDay }) => currentDay < day
    );
  }

  _getRecordsAfterDay(day = new Day(), options = {}) {
    return this._getRecordsContainsDay(day.next(), options).filter(
      ({ day: currentDay }) => currentDay > day
    );
  }

  _hasRecordsBeforeDay(day = new Day(), options = {}) {
    console.log(this._getRecordsBeforeDay(day, options));
    console.log(this._getRecordsBeforeDay(day, options).length !== 0);
    return this._getRecordsBeforeDay(day, options).length !== 0;
  }

  _hasRecordsAfterDay(day = new Day(), options = {}) {
    return this._getRecordsAfterDay(day, options).length !== 0;
  }

  _getRecordsContainsDay(day = new Day(), options = {}) {
    if (this.__records.length === 0) {
      return [];
    }

    const prevCloseDay = this._getPrevCloseDayAt(day);
    const nextCloseDay = this._getNextCloseDayAt(day);

    return this.__records.sort(getDayComparator('asc')).filter((record) => {
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

    return this.__records.filter(({ value }) =>
      this._compareValues(value, this.closeValue)
    );
  }

  _getRecordOn(day = new Day(), options = {}) {
    return this.__records.find((record) => {
      if (this.operation.name === 'update') {
        console.log(record);
        console.log(options);
      }
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

    const startRecord = this._getStartDayAt(record.day);
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
    return this._records.map(fn);
  }

  reduce(fn) {
    return this._records.reduce(fn);
  }

  filter(fn) {
    return this._records.filter(fn);
  }

  //  private methods

  //    oparations
  _setRecords({ newRecords } = { newRecords: [] }) {
    return this._emit({ name: 'set', args: { newRecords } });
  }

  _addRecord({ record }) {
    return this._emit({ name: 'add', args: { record } });
  }

  _deleteRecord({ record }) {
    return this._emit({ name: 'delete', args: { record } });
  }

  _updateRecord({ record, newRecord }) {
    // console.log(record);
    // console.log(newRecord);
    return this._emit({ name: 'update', args: { record, newRecord } });
  }

  _addClose(day) {
    return this._emit({ name: 'addClose', args: { day } });
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
    this.__records = [...newRecords];
  }

  _add({ record }) {
    this.__records = [...this.__records, record];
  }

  _delete({ record }) {
    this.__records = this.__records.filter(
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

  //    validation runner
  _validation(args) {
    const validationMethod = `_validate${upperFirst(
      this.operation.name
    )}Operation`;

    this[validationMethod](args);
  }

  //    validation setters
  _validateAddOperation({ record }, options = {}) {
    this.operation.error = this._getAddErrors({ record }, options);
  }

  _validateDeleteOperation({ record }, options = {}) {
    this.operation.error = this._getDeleteErrors({ record }, options);
  }

  _validateUpdateOperation({ record, newRecord }, options = {}) {
    this.operation.error = this._getUpdateErrors(
      { record, newRecord },
      options
    );
  }

  _validateSetOperation({ records }, options = {}) {
    this.operation.error = [];
  }

  _validateAddClosingOperation({ records }, options = {}) {
    this.operation.error = this._getCloseErrors({ day }, options);
  }

  //    validation error generators
  _getAddErrors({ record }, options = {}) {
    const error = {};

    const outOfActiveDiaryError = this._getOutOfActiveDiaryError(record);

    if (outOfActiveDiaryError !== null) {
      error.record = outOfActiveDiaryError;
    } else {
      const alreadyExistsError = this._getAlreadyExistsError(record, options);

      if (alreadyExistsError !== null) {
        error.record = alreadyExistsError;
      } else {
        const equalsToSurroundingValueError = this._getEqualsToSurroundingValueError(
          record,
          options
        );

        if (
          equalsToSurroundingValueError !== null &&
          !(
            options.ignoreRules !== undefined &&
            options.ignoreRules.contains(this._getEqualsToSurroundingValueError)
          )
        ) {
          error.record = equalsToSurroundingValueError;
        }
      }
    }

    return error;
  }

  _getAddClosingErrors({ day }, options = {}) {
    const error = {};

    if (this._isClosed) {
      error.day = errors.alreadyDefined;
    } else {
      const lastRecordDay = this._recordDay;

      if (day <= lastRecordDay) {
        // define error
        error.day = errors.backdatingNotPermitted;
      }

      const closeRecord = new this.RecordClass({
        value: this.closeValue,
        day,
      });
    }

    return error;
  }

  _getDeleteErrors({ record }, options = {}) {
    const error = {};

    const notFoundError = this._getNotFoundError(record, options);

    if (notFoundError !== null) {
      error.record = notFoundError;
    } else {
      const surroundingValuesEqualityError = this._getSurroundingValuesEqualityError(
        record,
        options
      );
      if (
        surroundingValuesEqualityError !== null &&
        !(
          options.ignoreRules !== undefined &&
          options.ignoreRules.contains(this._getEqualsToSurroundingValueError)
        )
      ) {
        error.record = surroundingValuesEqualityError;
      }
    }

    return error;
  }

  _getUpdateErrors({ record, newRecord }, options = {}) {
    const error = {};

    const nothingToUpdateError = this._getNothingToUpdateError(
      record,
      newRecord
    );

    if (nothingToUpdateError !== null) {
      error.record = nothingToUpdateError;
    } else {
      if (this._isDayBetweenSurroundingRecords(record, newRecord)) {
        error.record = this._getDeleteErrors(record, {
          ignoreRules: [this._getEqualsToSurroundingValueError],
        }).record;
        error.newRecord = this._getAddErrors(newRecord, {
          excludeRecords: [record],
          excludeRules: [this._getSurroundingValuesEqualityError],
        }).record;
      } else {
        error.record = this._getDeleteErrors({ record }).record;
        error.newRecord = this._getAddErrors(
          { record: newRecord },
          {
            excludeRecords: [record],
          }
        ).record;
        console.log(error);
      }
    }

    return error;
  }

  //    validation error generators
  _getOutOfActiveDiaryError(record) {
    if (record.day <= this._getPrevCloseDayAt()) {
      return errors.archiveIsReadOnly;
    }

    return null;
  }

  _getAlreadyExistsError(record, options = {}) {
    if (this._hasRecordOn(record.day, options)) {
      return errors.alreadyExists;
    }

    return null;
  }

  _getNotFoundError(record, options = {}) {
    if (!this._hasRecord(record, (options = {}))) {
      return errors.notFound;
    }

    return null;
  }

  _getEqualsToSurroundingValueError(record, options = {}) {
    const prevRecord = this._getPrevRecordAt(record.day, options);
    const nextRecord = this._getNextRecordAt(record.day, options);

    if (
      (prevRecord !== undefined && record.value === prevRecord.value) ||
      (nextRecord !== undefined && record.value === nextRecord.value)
    ) {
      return errors.equalsToSurroundingValue;
    }
    return null;
  }

  _getSurroundingValuesEqualityError(record, options = {}) {
    const prevRecord = this._getPrevRecord(record, options);
    const nextRecord = this._getNextRecord(record, options);

    if (
      prevRecord !== undefined &&
      nextRecord !== undefined &&
      this._compareRecordValues(prevRecord, nextRecord)
    ) {
      return errors.surroundingValuesAreEquals;
    }

    return null;
  }

  _getBeforeOrEqualPreviousCloseDayError(record) {
    const prevInerruptDayAt = this._getPrevCloseDayAt();

    if (prevInerruptDayAt !== undefined && record.day <= prevInerruptDayAt) {
      return `${
        record.constructor.name
      } cannot be before or equals previous end day`;
    }

    return null;
  }

  _getNothingToUpdateError(record, newRecord, options = {}) {
    if (record.equals(newRecord)) {
      return errors.nothingToUpdate;
    }

    return null;
  }

  //    validators utils

  _isExcludedRecord(record, recordsToExclude) {
    return (
      recordsToExclude.find((recordToExclude) =>
        recordToExclude.equals(record)
      ) !== -1
    );
  }

  _isDayBetweenSurroundingRecords(record, newRecord) {
    const prevRecordForRecord = this._getPrevRecord(record);
    const prevRecordForNewRecord = this._getPrevRecord(newRecord, {
      excludeRecords: [record],
    });
    // console.log(prevRecordForRecord);
    // console.log(prevRecordForNewRecord);

    return (
      prevRecordForRecord !== undefined &&
      prevRecordForRecord.equals(prevRecordForNewRecord)
    );
  }
}
