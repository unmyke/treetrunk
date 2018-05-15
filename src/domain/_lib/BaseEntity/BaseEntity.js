import { BaseId } from '../BaseId';
import { lowerFirst } from 'lodash';
import { Operation as ErrorFactrory } from '../../errorFactories';

export class BaseEntity {
  static errorFactrory = new ErrorFactrory();
  constructor(id = new BaseId()) {
    this[lowerFirst(id.constructor.name)] = id;
  }
}
