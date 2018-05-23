import uuidv4 from 'uuid/v4';
import { BaseValue } from '../BaseValue';

export class BaseId extends BaseValue {
  constructor({ value } = { value: uuidv4() }) {
    super();
    this.value = value;
  }

  valueOf() {
    return this.value;
  }

  toString() {
    return this.value;
  }

  toJSON() {
    return this.value;
  }
}
