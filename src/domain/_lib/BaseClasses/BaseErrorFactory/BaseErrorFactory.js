import { snakeCase } from 'lodash';

export class BaseErrorFactory {
  _create(message, details) {
    const error = new Error(message);
    error.details = details;
    error.code = snakeCase(message).toUpperCase();
    error.type = this.constructor.type;

    return error;
  }
}
