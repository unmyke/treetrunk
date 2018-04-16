import { BaseValue } from '../../BaseClasses';

export class PersonName extends BaseValue {
  constructor({ surname, firstName, middleName }) {
    super();
    this.surname = surname;
    this.firstName = firstName;
    this.middleName = middleName;
  }

  get fullName() {
    return `${this.surname} ${this.firstName} ${this.middleName}`;
  }
}
