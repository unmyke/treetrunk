import { lowerFirst } from 'lodash';

import { BaseErrorFactory } from './_lib';

export class OperationErrorFactory extends BaseErrorFactory {
  constructor() {
    super('OPERATION_ERROR');
  }

  createNothingToUpdate(entity, ...details) {
    return this._createOperation(entity, 'Nothing to update', ...details);
  }

  createNotAllowed(entity, ...details) {
    return this._createOperation(entity, 'Not allowed', ...details);
  }

  createNotFound(entity, ...details) {
    return this._createOperation(entity, 'Not found', ...details);
  }

  createAlreadyExists(entity, ...details) {
    return this._createOperation(entity, 'Already exists', ...details);
  }
  _createOperation(entity, message, ...details) {
    if (!this._isInstanceOfBaseClass(entity)) {
      return new Error('Not a Entity');
    }

    const entityPropName = `${lowerFirst(entity.constructor.name)}`;
    return this._create(message, {
      [entityPropName]: details,
    });
  }
}
