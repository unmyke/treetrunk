import { BaseId, BaseErrorFactory } from '../_lib';

export class ValidationErrorFactory extends BaseErrorFactory {
  constructor() {
    super('VALIDATION_ERROR');
  }

  create(details) {
    return this._create('Invalid Value', details);
  }
}
