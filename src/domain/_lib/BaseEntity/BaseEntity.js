import { lowerFirst } from 'lodash';
import { Operation as ErrorFactory } from 'src/infra/errorFactories';

import { BaseId } from '../BaseId';

export class BaseEntity {
  static errorFactory = new ErrorFactory();

  constructor(id = new BaseId()) {
    this[lowerFirst(id.constructor.name)] = id;
  }
}
