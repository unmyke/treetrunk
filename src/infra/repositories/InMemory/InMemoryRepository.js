import { BaseRepository } from '../_lib';
import { lowerFirst } from 'lodash';

export class InMemoryRepository extends BaseRepository {
  store = [];

  async getAll(props = {}) {
    return this.store.reduce((acc, item) => {
      const entity = this.entityMapper.toEntity(item);
      if (this._compare(entity, props)) {
        return [...acc, entity];
      }
      return acc;
    }, []);
  }

  async getOne(props) {
    return await this.getAll(props)[0];
  }

  async getById(id) {
    const item = this.store.find((item) => {
      const entity = this.entityMapper.toEntity(item);
      return id.equals(entity[this._idPropName(id)]);
    });

    if (item === undefined) {
      throw this.errorFactory.createIdNotFound(id);
    }

    return this.entityMapper.toEntity(item);
  }

  async getByIds(ids) {
    const entities = this.store.filer((item) => {
      const entity = this.entityMapper.toEntity(item);
      const entityId = this._entityId(entity);
      return ids.find((id) => entityId.eqauls(id));
    });

    if (entities.length === 0) {
      throw this.errorFactory.createIdsNotFound(ids);
    }

    return entities;
  }

  async add(entity) {
    this._validateUniqueness(entity);

    this.store.push(this.entityMapper.toDatabase(entity));
    return entity;
  }

  async save(entity) {
    this._validateUniqueness(entity);

    const entityId = this._entityId(entity);

    const index = this.store.findIndex((storedItem) => {
      const storedEntity = this.entityMapper.toEntity(storedItem);
      return this._entityId(storedEntity) === entityId;
    });
    this.store[index] = this.entityMapper.toDatabase(entity);

    return entity;
  }

  async remove(id) {
    const store = this.store.filter((item) => {
      const entity = this.entityMapper.toEntity(item);
      return !id.equals(entity[this._idPropName(id)]);
    });

    if (store.length === this.store.length) {
      throw this.errorFactory.createIdNotFound(id);
    }
    this.store = store;
  }

  async count(props) {
    return this.getAll(props).length;
  }

  async clear() {
    this.store = [];
  }

  _idPropName(id) {
    return lowerFirst(id.constructor.name);
  }

  _entityId(entity) {
    return entity[lowerFirst(`${entity.constructor.name}Id`)];
  }

  _compare(entity, props) {
    return Object.keys(props).reduce((isEquals, key) => {
      return isEquals && props[key] === entity[key];
    }, true);
  }

  _validateUniqueness(entity) {
    const { uniqueness } = this.constructor;
    if (!uniqueness) {
      return null;
    }

    const uniquenessKeys = Object.keys(uniqueness);
    if (uniquenessKeys.length === 0) {
      return null;
    }

    const uniqueless = {};

    uniquenessKeys.forEach((uniquenessKey) => {
      const persistedEntity = this.store.find((persistedItem) => {
        const persistedEntity = this.entityMapper.toEntity(persistedItem);
        if (uniqueness[uniquenessKey] === true) {
          return persistedEntity[uniquenessKey] === entity[uniquenessKey];
        }

        if (uniqueness[uniquenessKey] instanceof Object) {
          const uniquenessKeys = [
            uniquenessKey,
            ...uniqueness[uniquenessKey].with,
          ];
          return uniquenessKeys.reduce((isUniqueless, key) => {
            return isUniqueless && persistedEntity[key] === entity[key];
          }, true);
        }
      });

      if (persistedEntity) {
        uniqueless[uniquenessKey] = uniqueness[uniquenessKey];
      }
    });

    if (Object.keys(uniqueless).length !== 0) {
      throw this.errorFactory.createAlreadyExists(entity, uniqueless);
    }

    return null;
  }
}
