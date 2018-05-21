import { lowerFirst } from 'lodash';

import { BaseErrorFactory } from './_lib';
import { BaseId, BaseEntity } from 'src/domain/_lib';

export class OperationErrorFactory extends BaseErrorFactory {
  constructor() {
    super('OPERATION_ERROR');
  }

  createNothingToUpdate(entity, detail) {
    if (!(entity instanceof BaseEntity)) {
      return new Error('Not a Entity');
    }

    const entityPropName = `${lowerFirst(entity.constructor.name)}`;

    return this._create('Nothing to update', {
      [entityPropName]: [detail],
    });
  }

  createNotAllowed(entity, detail) {
    if (!(entity instanceof BaseEntity)) {
      return new Error('Not a Entity');
    }

    const entityPropName = `${lowerFirst(entity.constructor.name)}`;

    return this._create('Not allowed', {
      [entityPropName]: [detail],
    });
  }

  createNotAllowed(entity, detail) {
    if (!(entity instanceof BaseEntity)) {
      return new Error('Not a Entity');
    }

    const entityPropName = `${lowerFirst(entity.constructor.name)}`;

    return this._create('Not allowed', {
      [entityPropName]: [detail],
    });
  }
}
