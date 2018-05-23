import { snakeCase } from 'lodash';
import { BaseClass } from 'src/domain/_lib';

export class BaseErrorFactory {
  constructor(type) {
    this.type = type;
  }

  _create(message, details) {
    const error = new Error(message);
    error.details = details;
    error.code = snakeCase(message).toUpperCase();
    error.type = this.type;

    return error;
  }

  _isInstanceOfBaseClass(entity) {
    return entity instanceof BaseClass;
  }
}
