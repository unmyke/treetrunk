import { BaseErrorFactory } from './_lib';
import { BaseId } from 'src/domain/_lib';

export class ValidationErrorFactory extends BaseErrorFactory {
  constructor() {
    super('VALIDATION_ERROR');
  }

  create(details) {
    return this._create('InvalidValue', details);
  }
}
