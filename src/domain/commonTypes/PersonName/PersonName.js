import { BaseValue } from '../../_lib';

export class PersonName extends BaseValue {
  constructor({ lastName, firstName, middleName }) {
    super();
    this.lastName = lastName;
    this.firstName = firstName;
    this.middleName = middleName;
  }

  get fullName() {
    return `${this.lastName} ${this.firstName} ${this.middleName}`;
  }
}
