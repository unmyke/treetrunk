/* eslint-disable no-underscore-dangle */
import { applyFSM, getIdPropName } from '../base-methods';
import BaseClass from '../base-class';

export default class BaseEntity extends BaseClass {
  constructor({ id, createdAt = new Date(), updatedAt }) {
    super();
    const idPropName = getIdPropName(id);
    this[idPropName] = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    applyFSM(this.constructor);
    this._fsm();
  }
}
