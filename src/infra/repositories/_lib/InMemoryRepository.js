import { BaseRepository } from './BaseRepository';
import { BaseId } from 'src/domain/_lib/BaseClasses';
import { addErrorDefinitionProperty } from 'src/infra/support/addErrorDefinition';
import { lowercaseFirstLetter } from 'src/infra/support/changeCaseFirstLetter';

export class InMemoryRepository extends BaseRepository {
  store = [];

  getById(id) {
    return this.store.find((item) => item[this._idPropName(id)].equals(id));
  }

  deleteById(id) {
    this.store = this.store.filter(
      (item) => !item[this._idPropName(id)].equals(id)
    );
  }

  save(entity) {
    const entityId = this._entityId(entity);
    this.store = this.store.map((item) => {
      return entityId.equals(this._entityId[item]) ? entity : item;
    });
  }

  getAll(props) {
    return this.store.reduce((acc, item) => {
      return _compare(item, props) ? [...acc, item] : acc;
    }, []);
  }

  count(props) {
    return this.getAll(props).length;
  }

  _idPropName(id) {
    return lowercaseFirstLetter(id.constuctor.name);
  }

  _entityId(entity) {
    return entity[lowercaseFirstLetter(`${entity.constuctor.name}Id`)];
  }

  _compare(entity, props) {
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
