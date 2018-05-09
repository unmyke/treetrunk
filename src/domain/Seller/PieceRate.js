import { BaseValue } from '../_lib/BaseClasses';

export class PieceRate extends BaseValue {
  constructor({ value, day }) {
    super();
    this.value = value;
    this.day = day;
  }

  toJSON() {
    return {
      value: this.value,
      date: this.day.toString(),
    };
  }
}
