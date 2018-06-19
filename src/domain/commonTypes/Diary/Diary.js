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
    const argNames = Object.keys(this.operation.error);

    const errorsExists = argNames.reduce(
      (errorExists, argName) =>
        errorExists || this.operation.error[argName].length !== 0,
      false
    );

    if (!errorsExists) {
      return 'result';
    }

    return 'error';
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
    return this.isClosedAt(day);
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

  //    oparations
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

  //    validation runner
  _validation(args) {
    const validationMethod = `_validate${upperFirst(
      this.operation.name
    )}Operation`;

    this[validationMethod](args);
  }

  //    validation setters
  _validateSetOperation({ newRecords }, options = {}) {
    this.operation.error = this._getSetErrors({ newRecords }, options);
  }

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

  _validateAddCloseOperation({ records }, options = {}) {
    this.operation.error = this._getAddCloseErrors({ day }, options);
  }

  _validateDeleteCloseOperation() {
    this.operation.error = this._getDeleteCloseErrors();
  }

  //    validation error generators
  _getSetErrors({ newRecords }, options = {}) {
    const newRecordsType = `new{this.RecordClass.name}s`;

    const error = { [newRecordsType]: [] };

    return error;
  }

  _getAddErrors({ record }, options = {}) {
    const recordType = lowerFirst(this.RecordClass.name);

    const error = { [recordType]: [] };

    const outOfActiveDiaryError = this._getOutOfActiveDiaryError(record);

    if (outOfActiveDiaryError !== null) {
      error[recordType].push(outOfActiveDiaryError);
    } else {
      const alreadyExistsError = this._getAlreadyExistsError(record, options);

      if (alreadyExistsError !== null) {
        error[recordType].push(alreadyExistsError);
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
          error[recordType].push(equalsToSurroundingValueError);
        }
      }
    }

    return error;
  }

  _getDeleteErrors({ record }, options = {}) {
    const recordType = lowerFirst(this.RecordClass.name);

    const error = { [recordType]: [] };

    const notFoundError = this._getNotFoundError(record, options);

    if (notFoundError !== null) {
      error[recordType].push(notFoundError);
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
        error[recordType].push(surroundingValuesEqualityError);
      }
    }

    return error;
  }

  _getUpdateErrors({ record, newRecord }, options = {}) {
    const recordType = lowerFirst(this.RecordClass.name);
    const newRecordType = `new${this.RecordClass.name}`;

    const error = { [recordType]: [], [newRecordType]: [] };

    const nothingToUpdateError = this._getNothingToUpdateError(
      record,
      newRecord
    );

    if (nothingToUpdateError !== null) {
      error[recordType].push(nothingToUpdateError);
    } else {
      if (this._isDayBetweenSurroundingRecords(record, newRecord)) {
        const deleteErrors = this._getDeleteErrors(record, {
          ignoreRules: [this._getEqualsToSurroundingValueError],
        });
        error[recordType].push(...deleteErrors[recordType]);

        const addErrors = this._getAddErrors(newRecord, {
          excludeRecords: [record],
          excludeRules: [this._getSurroundingValuesEqualityError],
        });
        error[newRecordType].push(...addErrors[recordType]);
      } else {
        const deleteErrors = this._getDeleteErrors({ record });
        error[recordType].push(...deleteErrors[recordType]);

        const addErrors = this._getAddErrors(
          { record: newRecord },
          {
            excludeRecords: [record],
          }
        );
        error[newRecordType].push(...addErrors[recordType]);
      }
    }

    return error;
  }

  _getAddCloseErrors({ day }, options = {}) {
    const error = { record: [] };

    if (this.isClosed) {
      error[recordType].push(errors.alreadyDefined);
    } else {
      const lastRecordDay = this.recordDay;

      if (day <= lastRecordDay) {
        // define error
        error[recordType].push(errors.backdatingNotPermitted);
      }
    }

    return error;
  }

  _getDeleteCloseErrors() {
    const error = { record: [] };

    if (!this.isClosed) {
      error[recordType].push(errors.dairyAlreadyClosed);
    } else {
      const records = this.records;

      if (records.length === 0) {
        error[recordType].push(errors.dairyNotStarted);
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

  // _getBeforeOrEqualPreviousCloseDayError(record) {
  //   const prevInerruptDayAt = this._getPrevCloseDayAt();

  //   if (prevInerruptDayAt !== undefined && record.day <= prevInerruptDayAt) {
  //     return `${
  //       record.constructor.name
  //     } cannot be before or equals previous end day`;
  //   }

  //   return null;
  // }

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
