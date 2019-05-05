/* eslint-disable no-underscore-dangle */
import { applyFSM, getIdPropName } from '../base-methods';
import BaseClass from '../base-class';

export default class BaseEntity extends BaseClass {
  constructor({ id, createdAt = new Date(), updatedAt, deletedAt }) {
    super();
    const idPropName = getIdPropName(id);
    this[idPropName] = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;

    applyFSM(this.constructor);
    this._fsm();
  }

  equals(entity) {
    const idPropName = `${this.constuctor.name.toLowerCase()}Id`;
    const isInstanceOfSameClass = this.constuctor === entity.constructor;
    const isIdinstanceOfSameClass =
      this[idPropName].constuctor === entity[idPropName].constructor;
    const isIdEqual = this[idPropName].equals(entity[idPropName]);

    return isInstanceOfSameClass && isIdinstanceOfSameClass && isIdEqual;
  }
}
