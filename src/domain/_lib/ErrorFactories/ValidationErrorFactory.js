import { BaseId, BaseErrorFactory } from '../BaseClasses';

export class ValidationErrorFactory extends BaseErrorFactory {
  static type = 'VALIDATION_ERROR';

  create(details) {
    return this._create('Invalid Value', details);
  }
}
