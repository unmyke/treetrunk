import { lowerFirst } from 'lodash';

import { applyFSM } from './applyFSM';
import { BaseId } from '../BaseId';
import { BaseClass } from '../BaseClass';

import { Operation as ErrorFactory } from 'src/infra/errorFactories';

export class BaseEntity extends BaseClass {
  static errorFactory = new ErrorFactory();

  constructor(id = new BaseId()) {
    super();
    this[lowerFirst(id.constructor.name)] = id;
    applyFSM(this.constructor);
    this._fsm();
  }

  _getDayComparator(orderBy = 'asc') {
    return function(a, b) {
      switch (orderBy) {
        case 'desc':
          return a.day < b.day;
        default:
          return a.day > b.day;
      }
    };
  }
}
