import { lowerFirst } from 'lodash';

import { applyFSM, getDayComparator } from '../BaseMethods';
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

    this._getDayComparator = getDayComparator;
  }
}
