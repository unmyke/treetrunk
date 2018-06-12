import { lowerFirst } from 'lodash';

import { applyFSM } from '../BaseMethods';
import { BaseId } from '../BaseId';
import { BaseClass } from '../BaseClass';
import { errors } from '../../errors';

export class BaseEntity extends BaseClass {
  constructor(id = new BaseId()) {
    super();
    this[lowerFirst(id.constructor.name)] = id;

    applyFSM(this.constructor);
    this._fsm();
    this.errors = errors;
  }
}
