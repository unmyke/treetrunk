import { BaseRepository } from './BaseRepository';
import { BaseId } from 'src/domain/_lib/BaseClasses';
import { addErrorDefinitionProperty } from 'src/infra/support/addErrorDefinition';
import { lowercaseFirstLetter } from 'src/infra/support/changeCaseFirstLetter';

export class InMemoryRepository extends BaseRepository {
  store = [];

  async getById(id) {
    const entity = this.store.find((item) =>
      item[this._idPropName(id)].equals(id)
    );

    if (entity === undefined) {
      throw new Error('NOT_FOUND');
    }

    return entity;
  }

  async getAll(props) {
    return this.store.reduce((acc, item) => {
      return this._compare(item, props) ? [...acc, item] : acc;
    }, []);
  }

  async getOne(props) {
    return this.getAll(props)[0];
  }

  async add(entity) {
    const entityId = this._entityId(entity);
    this.store.push(entity);
    return entity;
  }

  async save(entity) {
    const entityId = this._entityId(entity);

    const index = this.store.findIndex(
      (storedEntity) => this._entityId(storedEntity) === entityId
    );
    this.store[index] = entity;

    return entity;
  }

  async remove(id) {
    this.store = this.store.filter(
      (item) => !item[this._idPropName(id)].equals(id)
    );
  }

  async count(props) {
    return this.getAll(props).length;
  }

  async _idPropName(id) {
    return lowercaseFirstLetter(id.constructor.name);
  }

  async _entityId(entity) {
    return entity[lowercaseFirstLetter(`${entity.constructor.name}Id`)];
  }

  async _compare(entity, props) {
    Object.keys(props).reduce((isEquals, key) => {
      return isEquals && props[key] === entity[key];
    }, true);
  }
}

addErrorDefinitionProperty(
  InMemoryRepository,
  'IncorrectInput',
  'Passed argument must be instance of BaseId'
);
