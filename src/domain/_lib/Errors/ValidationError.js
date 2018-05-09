import { BaseError } from '../BaseClasses';

export class ValidationError extends BaseError {
  constructor(details) {
    super({ message: 'ValidationError', details });
    this.propName = 'VALIDATION';
  }
}
