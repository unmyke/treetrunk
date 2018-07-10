export function recordAlreadyExistsRule({ day }, options = {}) {
  if (this.operatee._hasRecordOn(day, options)) {
    throw this.errors.recordAlreadyExists();
  }
}
