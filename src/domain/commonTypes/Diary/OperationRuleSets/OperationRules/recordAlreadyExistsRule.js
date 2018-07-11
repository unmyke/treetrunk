export function recordAlreadyExistsRule({ record: { day } }, options = {}) {
  if (this.operatee.hasRecordOn(day, options)) {
    throw this.errors.recordAlreadyExists();
  }
}
