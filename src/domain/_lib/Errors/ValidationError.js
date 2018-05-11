import { BaseError, BaseId } from '../BaseClasses';

export class ValidationError extends BaseError {
  static create(message, details, codeSufix) {
    const error = new ValidationError({ message, details });
    error.setCodeSufix(codeSufix);

    return error;
  }

  constructor({ message, details }) {
    super({ message, details });

    this._setCodePrefix('VALIDATION_ERROR');
  }
}
