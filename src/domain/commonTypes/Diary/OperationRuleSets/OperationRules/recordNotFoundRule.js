export function recordNotFoundRule({ record }, options) {
  if (!this.operatee.hasRecord(record, options)) {
    throw this.errors.recordNotFound();
  }
}
