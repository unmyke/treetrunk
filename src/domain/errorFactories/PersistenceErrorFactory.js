import { lowerFirst } from 'lodash';

import { BaseId, BaseEntity, BaseErrorFactory } from '../_lib';

export class PersistenceErrorFactory extends BaseErrorFactory {
  constructor() {
    super('PERSISTENCE_ERROR');
  }

  createIdNotFound(id) {
    if (!(id instanceof BaseId)) {
      return;
    }

    const EntityName = id.constructor.name.slice(0, -2);
    const entityIdPropName = lowerFirst(id.constructor.name);

    return this._create('Not found', {
      [entityIdPropName]: [
        `${EntityName} with ${entityIdPropName}: "${id}" not found.`,
      ],
    });
  }

  createIdsNotFound(ids) {
    if (!ids.reduce((isId, id) => isId || id instanceof BaseId, false)) {
      return;
    }

    const EntityName = ids[0].constructor.name.slice(0, -2);
    const entityIdPropName = lowerFirst(ids[0].constructor.name);

    return this._create('Not found', {
      [entityIdPropName]: [
        `${EntityName} with ${entityIdPropName} in ["${ids.join(
          '", "'
        )}"] not found.`,
      ],
    });
  }

  createAlreadyExists(entity, uniqueless) {
    if (!(entity instanceof BaseEntity)) {
      return new Error('Not a Entity');
    }

    const details = {};
    const keys = Object.keys(uniqueless);
    const EntityName = entity.constructor.name;

    keys.forEach((key) => {
      let keyDetails;
      if (uniqueless[key] === true) {
        keyDetails = `${key}: "${entity[key]}"`;
      }
      if (uniqueless[key] instanceof Object) {
        const keys = [key, ...uniqueless[key].with];
        keyDetails = keys.map((key) => `${key}: "${entity[key]}"`).join(', ');
      }
      details[key] = [`${EntityName} with ${keyDetails} already exists.`];
    });

    return this._create('Already exists', details);
  }
}
