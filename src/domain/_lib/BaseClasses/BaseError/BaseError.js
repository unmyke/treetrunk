export class BaseError extends Error {
  constructor({ message, details }) {
    super(message);

    this.name = this.constructor.name;
    this.details = details;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }

  get code() {
    return `${this._codePrefix}::${this._codeSufix}`;
  }

  _setCodePrefix(codePrefix) {
    this._codePrefix = codePrefix;
  }

  setCodePrefix(codeSufix) {
    this._codeSufix = codeSufix;
  }
}
