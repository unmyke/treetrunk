import { BaseError, BaseId } from '../BaseClasses';
import { lowercaseFirstLetter } from 'src/infra/support/changeCaseFirstLetter';

export class PersistenceError extends BaseError {
  static createNotFoundError(id) {
    if (!(id instanceof BaseId)) {
      return;
    }

    const EntityName = id.constructor.name.slice(0, -2);
    const entityIdPropName = lowercaseFirstLetter(id.constructor.name);

    const error = new PersistenceError({
      message: `${EntityName} not found`,
      details: {
        [entityIdPropName]: `${EntityName} with ${entityIdPropName}: ${id} not found.`,
      },
    });

    error.setCodeSufix('NOT_FOUND');

    return error;
  }

  static createAlreadyExists(id) {
    if (!(id instanceof BaseId)) {
      return;
    }

    const EntityName = id.constructor.name.slice(0, -2);
    const entityIdPropName = lowercaseFirstLetter(id.constructor.name);

    const error = new PersistenceError({
      message: `${EntityName} already exists`,
      details: {
        [entityIdPropName]: `${EntityName} with ${entityIdPropName}: ${id} already exists.`,
      },
    });

    error.setCodeSufix('ALREADY_EXISTS');

    return error;
  }

  constructor({ message, details }) {
    super({ message, details });
    console.log(Object.getOwnPropertyNames(this));
    this._setCodePrefix('PERSISTENCE_ERROR');
  }
}
