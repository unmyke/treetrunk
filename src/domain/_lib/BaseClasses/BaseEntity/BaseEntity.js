import { BaseId } from '../BaseId';
import { lowercaseFirstLetter } from 'src/infra/support/changeCaseFirstLetter';

export class BaseEntity {
  constructor(id = new BaseId()) {
    this[lowercaseFirstLetter(id.constructor.name)] = id;
  }
}
