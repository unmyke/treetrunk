import uuidv4 from 'uuid/v4';
import { BaseValue } from '../base-value';

export class BaseId extends BaseValue {
  constructor({ value } = { value: uuidv4() }) {
    super();
    this._value = value;
  }

  get value() {
    return this._value;
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
