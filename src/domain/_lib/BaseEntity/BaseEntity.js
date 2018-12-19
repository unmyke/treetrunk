import { upperFirst } from 'lodash';
import { applyFSM, getIdPropName } from '../BaseMethods';
import commonTypes from '../../commonTypes';
import { BaseClass } from '../BaseClass';

export class BaseEntity extends BaseClass {
  constructor({ createdAt = new Date(), updatedAt, ...idContainer }) {
    super();
    const idPropName = getIdPropName(idContainer);
    const idPropClassName = upperFirst(idPropName);
    this[idPropName] =
      idContainer[idPropName] || new commonTypes[idPropClassName]();
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    applyFSM(this.constructor);
    this._fsm();
  }
}
