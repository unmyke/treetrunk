import { BaseError } from '../BaseClasses';

export class NotFoundError extends BaseError {
  constructor(details) {
    super({ message: 'NotFoundError', details });
    this.propName = 'NOT_FOUND';
  }
}
