import { upperFirst, lowerCase } from 'lodash';
import { BaseClass } from 'src/domain/_lib/BaseClass';

export class BaseErrorFactory {
  constructor(type) {
    this.type = type;
  }

  _create(code, details) {
    const error = new Error(upperFirst(lowerCase(code)));
    error.details = details;
    error.code = code;
    error.type = this.type;

    return error;
  }

  _isInstanceOfBaseClass(entity) {
    return entity instanceof BaseClass;
  }
}
