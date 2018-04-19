import uuidv4 from 'uuid/v4';
import { BaseValue } from '../BaseValue';

export class BaseId extends BaseValue {
  constructor(id = uuidv4()) {
    super();
    this.id = id;
  }

  valueOf() {
    return this.id;
  }

  toString() {
    return this.id;
  }
}
