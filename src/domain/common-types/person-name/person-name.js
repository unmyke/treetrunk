import { BaseValue } from '../../_lib';

export class PersonName extends BaseValue {
  constructor({ lastName, firstName, middleName }) {
    super();
    this._firstName = firstName;
    this._middleName = middleName;
    this._lastName = lastName;
  }

  get firstName() {
    return this._firstName;
  }

  get middleName() {
    return this._middleName;
  }

  get lastName() {
    return this._lastName;
  }

  get fullName() {
    return `${this.lastName} ${this.firstName} ${this.middleName}`;
  }
  get fullName() {
    return `${this.lastName} ${this.firstName} ${this.middleName}`;
  }
}
