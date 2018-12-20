import { upperFirst } from 'lodash';
import { applyFSM, getIdPropName } from '../base-methods';
import commonTypes from '../../common-types';
import { BaseClass } from '../base-class';

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
