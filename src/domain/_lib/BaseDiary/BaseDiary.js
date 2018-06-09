import { lowerFirst, lowerCase, upperFirst, upperCase } from 'lodash';

import { applyFSM, getDayComparator } from '../../_lib/BaseMethods';
import { BaseClass } from '../../_lib/BaseClass';
import { BaseValue } from '../../_lib/BaseValue';

import { Day } from '../../commonTypes';

export class BaseDiary extends BaseClass {
  // FSM
  static fsm = {
    init: 'idle',

    transitions: [
      { name: 'operate', from: 'idle', to: 'validation' },
      {
        name: 'process',
        from: 'validation',
        to: BaseDiary.getPostValidationState,
      },
      { name: 'reset', from: ['result', 'error'], to: 'idle' },
    ],

    methods: {
      onValidation(lifecycle, operation) {
        this.operation = { ...operation, errors: [] };

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
          error: this.operation.errors,
        };
      },
    },
  };

  // state-transition functions
  static getPostValidationState() {
    if (this.operation.errors.length === 0) {
      return 'result';
    }
    return 'error';
  }

  constructor() {
    super();

    this._records = [];

    applyFSM(this.constructor);
    this._fsm();
  }

  // getters

  //  public metods
  get records() {
    return this.getRecordsAt();
  }

  get hasRecords() {
    return this.hasRecordsAt();
  }

  get recordValue() {
    return this.getRecordValueAt();
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

  get isCloseed() {
    return this.isCloseedAt(day);
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

  getStartDayAt(day = new Day(), options = {}) {
    const records = this.getRecordsAt(day, options);

    if (records.length === 0) {
      return;
    }

    return records[0].day;
  }

  isStartedAt(day = new Day()) {
    const startDay = this.getStartDayAt(day);
    return !!startDay;
  }

  getCloseDayAt(day = new Day()) {
    if (this._isCloseDay(day)) {
      return day;
    }

    return this._getRecordAt(day) === undefined
      ? this._getPrevCloseDayAt(day)
      : undefined;
  }

  isCloseedAt(day = new Day()) {
    return !!this.getCloseDayAt(day);
  }

  //  private metods
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

    if (record !== undefined && this._isCloseRecord(record)) {
      return true;
    }

    return false;
  }

  _isCloseRecord(record) {
    if (record === undefined) {
      return false;
    }

    return this._isCloseDay(record.day);
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
    if (this.constructor.closeValue === undefined) {
      return [];
    }

    return this._records.filter(({ value }) =>
      this._compareValues(value, this.constructor.closeValue)
    );
  }

  _getRecordOn(day = new Day(), options = {}) {
    return this._records.find((record) => record.day.equals(day));
  }

  _isCloseRecord(record) {
    if (record === undefined) {
      return false;
    }

    return this._compareRecordValues(record.value, this.constructor.closeValue);
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
  setRecords(newRecords = []) {
    return this._emit({ name: 'set', args: { newRecords } });
  }

  addRecord(record) {
    return this._emit({ name: 'add', args: { record } });
  }

  deleteRecord(record) {
    return this._emit({ name: 'delete', args: { record } });
  }

  editRecord(record, newRecord) {
    return this._emit({ name: 'edit', args: { record, newRecord } });
  }

  addClose(day) {
    return this._emit({ name: 'addClose', args: { day } });
  }

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

  _edit({ record, newRecord }) {
    this._delete({ record });
    this._add({ record: newRecord });
  }

  _addClose({ day }) {
    const closeRecord = new this.constructor.RecordClass({
      value: this.constructor.closeValue,
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
    this.operation.errors = this._getAddErrors({ record }, options);
  }

  _validateDeleteOperation({ record }, options = {}) {
    this.operation.errors = this._getDeleteErrors({ record }, options);
  }

  _validateEditOperation({ record, newRecord }, options = {}) {
    this.operation.errors = this._getEditErrors({ record, newRecord }, options);
  }

  _validateSetOperation({ records }, options = {}) {
    this.operation.errors = [];
  }

  _validateAddCloseOperation({ records }, options = {}) {
    this.operation.errors = this._getCloseErrors({ day }, options);
  }

  //    validation error generators
  _getAddErrors({ record }, options = {}) {
    const errors = {};

    const alreadyExistsError = this._getAlreadyExistsError(record, options);

    if (alreadyExistsError !== null) {
      error.record = [alreadyExistsError];
    } else {
      const prevOrNextValuesNotEqualPassedRecordValueErrors = this._collectErrors(
        this._getPrevValueNotEqualsError(record, options),
        this._getNextValueNotEqualsError(record, options)
      );

      if (prevOrNextValuesNotEqualPassedRecordValueErrors.length !== 0) {
        error.record = prevOrNextValuesNotEqualPassedRecordValueErrors;
      } else {
        const notInCurrentRecordsError = this._getNotInCurrentRecordsError(
          record
        );

        if (notInCurrentRecordsError !== null) {
          errors.record = [notInCurrentRecordsError];
        }
      }
    }

    return errors;
  }

  _getAddCloseErrors({ day }, options = {}) {
    const closeRecord = new this.constructor.RecordClass({
      value: this.constructor.closeValue,
      day,
    });

    return this._collectErrors(
      this._getAlreadyExistsError(closeRecord, options),
      this._getPrevValueNotEqualsError(closeRecord, options),
      this._getNextValueNotEqualsError(closeRecord, options)
    );
  }

  _getDeleteErrors({ record }, options = {}) {
    return this._collectErrors(
      this._getPrevAndNextEqualityError(record, options),
      this._getNotFoundError(record, options)
    );
  }

  _getEditErrors({ record, newRecord }, options = {}) {
    const errors = [];

    errors.push(this._getNothingToUpdateError(record, newRecord, options));

    if (this._isDayBetweenSameRangeWithRecord(newRecord.day, record, options)) {
      errors.push(
        this._getPrevValueNotEqualsError(newRecord, {
          ...options,
          excludeRecords: [record],
        }),
        this._getNextValueNotEqualsError(newRecord, {
          ...options,
          excludeRecords: [record],
        })
      );
    }

    errors.push(
      this._getDeleteErrors(record, options),
      this._getAddErrors(newRecord, { ...options, excludeRecords: [record] })
    );

    return this._collectErrors(errors);
  }

  //    validation errors collector
  _collectErrors(...errors) {
    return errors.filter((error) => error !== null);
  }

  //    validation error generators
  _getCloseRecordError(record, options = {}) {
    if (this._isCloseRecord(record)) {
      return 'Close record not allowed by method';
    }

    return null;
  }

  _getAlreadyExistsError(record, options = {}) {
    if (record === undefined || this._hasRecordOn(record.day, options)) {
      const upperFirstRecordName = upperFirst(
        lowerCase(record.constructor.name)
      );

      return `${upperFirstRecordName} with value "${record.value.toString()}" at ${record.day.toString()} already exists`;
    }

    return null;
  }

  _getNotFoundError(record, options = {}) {
    if (!this._hasRecord(record, (options = {}))) {
      const upperFirstRecordName = upperFirst(
        lowerCase(record.constructor.name)
      );

      return `${upperFirstRecordName} with value "${record.value.toString()}" at ${record.day.toString()} not found`;
    }

    return null;
  }

  _getPrevValueNotEqualsError(record, options = {}) {
    const recordName = lowerCase(record.constructor.name);
    const prevRecord = this._getPrevRecordAt(record.day, options);

    if (prevRecord !== undefined && record.value === prevRecord.value) {
      return `Previous ${recordName} already have value "${prevRecord.value}"`;
    }
    return null;
  }

  _getNextValueNotEqualsError(record, options = {}) {
    const recordName = lowerCase(record.constructor.name);
    const nextRecord = this._getNextRecordAt(record.day, options);

    if (nextRecord !== undefined && record.value === nextRecord.value) {
      return `Next ${recordName} already have value "${nextRecord.value}"`;
    }

    return null;
  }

  _getPrevAndNextEqualityError(record, options = {}) {
    const prevRecord = this._getPrevRecord(record, options);
    const nextRecord = this._getNextRecord(record, options);

    if (
      prevRecord !== undefined &&
      nextRecord !== undefined &&
      this._compareRecordValues(prevRecord, nextRecord)
    ) {
      const recordName = lowerCase(record.constructor.name);
      return `Previous ${recordName} eqauls next ${recordName}`;
    }

    return null;
  }

  _getBeforeOrEqualPreviousCloseDayError(record) {
    const recordName = lowerCase(record.constructor.name);

    const prevInerruptDayAt = this._getPrevCloseDayAt();

    if (prevInerruptDayAt !== undefined && record.day <= prevInerruptDayAt) {
      return `${
        record.constructor.name
      } cannot be before or equals previous end day`;
    }

    return null;
  }

  _getNothingToUpdateError(record, newRecord, options = {}) {
    if (record !== undefined && record.equals(newRecord)) {
      return 'Nothing to update';
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

  _isDayBetweenSameRangeWithRecord(day, record) {
    const prevRecordForDay = this._getPrevRecordAt(day);
    const prevRecordForRecord = this._getPrevRecord(record);

    return (
      prevRecordForDay !== undefined &&
      prevRecordForDay.equals(prevRecordForRecord)
    );
  }
}
