import { BaseId, BaseErrorFactory, BaseEntity } from '../BaseClasses';
import { lowerFirst } from 'lodash';

export class OperationErrorFactory extends BaseErrorFactory {
  static type = 'OPERATION_ERROR';

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
