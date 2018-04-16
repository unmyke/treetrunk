import { BaseValue } from '../../BaseClasses';

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
