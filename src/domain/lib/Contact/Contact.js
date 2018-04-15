import { BaseValue } from '../BaseValue';

export class Contact extends BaseValue {
  constructor({ type, value }) {
    super();
    this.type = type;
    this.value = value;
  }

  get info() {
    return `${this.type}: ${this.value}`;
  }
}
