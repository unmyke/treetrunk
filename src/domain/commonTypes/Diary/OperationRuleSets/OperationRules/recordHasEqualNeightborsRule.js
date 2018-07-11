export function recordHasEqualNeightborsRule({ record }, options = {}) {
  const prevRecord = this.operatee.getPrevRecord(record, options);
  const nextRecord = this.operatee.getNextRecord(record, options);

  if (
    prevRecord !== undefined &&
    nextRecord !== undefined &&
    this.operatee.compareRecordValues(prevRecord, nextRecord)
  ) {
    throw errors.recordHasEqualNeightbors();
  }
}
