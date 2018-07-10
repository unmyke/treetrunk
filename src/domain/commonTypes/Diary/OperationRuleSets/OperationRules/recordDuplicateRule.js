export function recordDuplicateRule({ value, day }, options = {}) {
  const prevRecord = this.operatee._getPrevRecordAt(day, options);
  const nextRecord = this.operatee._getNextRecordAt(day, options);

  if (
    (prevRecord !== undefined && value === prevRecord.value) ||
    (nextRecord !== undefined && value === nextRecord.value)
  ) {
    throw this.errors.recordDuplicate();
  }
}
