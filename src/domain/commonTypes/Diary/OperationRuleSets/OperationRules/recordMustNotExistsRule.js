export const recordMustNotExistsRule = {
  type: 'rule',
  error: this.errors.recordAlreadyExists,

  check: function({ record: { day } }, options = {}) {
    if (this.operatee.hasRecordOn(day, options)) {
      throw this.error();
    }
  },
};
