export function recordDuplicateRule({ record: { value, day } }, options = {}) {
  const prevRecord = this.operatee.getPrevRecordAt(day, options);
  const nextRecord = this.operatee.getNextRecordAt(day, options);

  if (
    (prevRecord !== undefined && value === prevRecord.value) ||
    (nextRecord !== undefined && value === nextRecord.value)
  ) {
    throw this.errors.recordDuplicate();
  }
}
