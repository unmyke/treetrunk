//    validation runner
class validation {
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
    const newRecordsType = `new${this.RecordClass.name}s`;

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

    return (
      prevRecordForRecord !== undefined &&
      prevRecordForRecord.equals(prevRecordForNewRecord)
    );
  }
}
