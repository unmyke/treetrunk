import { lowerFirst } from 'lodash';

import { BaseErrorFactory } from './_lib';

export class OperationErrorFactory extends BaseErrorFactory {
  constructor() {
    super('OPERATION_ERROR');
  }

  createNothingToUpdate(entity, ...details) {
    return this._createOperation(entity, 'NothingToUpdate', ...details);
  }

  createNotAllowed(entity, ...details) {
    return this._createOperation(entity, 'NotAllowed', ...details);
  }

  createNotFound(entity, ...details) {
    return this._createOperation(entity, 'NotFound', ...details);
  }

  createAlreadyExists(entity, ...details) {
    return this._createOperation(entity, 'AlreadyExists', ...details);
  }
  _createOperation(entity, message, ...details) {
    if (!this._isInstanceOfBaseClass(entity)) {
      return new Error('NotAEntity');
    }

    const entityPropName = `${lowerFirst(entity.constructor.name)}`;
    return this._create(message, {
      [entityPropName]: details,
    });
  }
}
