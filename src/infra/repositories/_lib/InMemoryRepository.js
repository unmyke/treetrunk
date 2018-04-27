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

  updateById(id, props) {
    this.store = this.store;
  }

  _idPropName(id) {
    return lowercaseFirstLetter(id.constuctor.name);
  }
}

addErrorDefinitionProperty(
  InMemoryRepository,
  'IncorrectInput',
  'Passed argument must be instance of BaseId'
);
