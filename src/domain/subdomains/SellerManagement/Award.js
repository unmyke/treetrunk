import { BaseValue } from '../../_lib';
import { Day } from '../../commonTypes';

export class Award extends BaseValue {
  constructor({ value, day = new Day() }) {
    super();
    this.value = value;
    this.day = day;
  }
  toJSON() {
    return {
      value: this.value,
      date: this.day.toJSON(),
    };
  }
}
