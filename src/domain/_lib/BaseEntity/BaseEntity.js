import { lowerFirst } from 'lodash';

import { BaseId } from '../BaseId';

export class BaseEntity {
  static setErrorFactory(errorFactory) {
    BaseEntity.errorFactory = errorFactory;
  }
  constructor(id = new BaseId()) {
    this[lowerFirst(id.constructor.name)] = id;
  }
}
