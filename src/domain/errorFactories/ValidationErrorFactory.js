// import { BaseId, BaseErrorFactory } from '../_lib';
import { BaseId } from '../_lib';
import { BaseErrorFactory } from '../_lib/BaseErrorFactory';

export class ValidationErrorFactory extends BaseErrorFactory {
  constructor() {
    super('VALIDATION_ERROR');
  }

  create(details) {
    return this._create('Invalid Value', details);
  }
}
