import { BaseId, BaseErrorFactory, BaseEntity } from '../_lib';
import { lowerFirst } from 'lodash';

export class OperationErrorFactory extends BaseErrorFactory {
  constructor() {
    super('OPERATION_ERROR');
  }

  createNothingToUpdate(entity) {
    if (!(entity instanceof BaseEntity)) {
      return new Error('Not a Entity');
    }

    const entityIdPropName = `${lowerFirst(entity.constructor.name)}Id`;

    return this._create('Nothing to update', {
      [entityIdPropName]: ['Nothig to update.'],
    });
  }
}
