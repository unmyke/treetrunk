import { lowerFirst } from 'lodash';

import { BaseId, BaseEntity, BaseErrorFactory } from '../_lib';
// import { BaseId, BaseEntity } from '../_lib';
// import { BaseErrorFactory } from '../_lib/BaseErrorFactory';

export class OperationErrorFactory extends BaseErrorFactory {
  constructor() {
    super('OPERATION_ERROR');
  }

  createNothingToUpdate(entity) {
    if (!(entity instanceof BaseEntity)) {
      return new Error('Not a Entity');
    }

    const entityPropName = `${lowerFirst(entity.constructor.name)}`;

    return this._create('Nothing to update', {
      [entityPropName]: ['Nothing to update.'],
    });
  }
}
