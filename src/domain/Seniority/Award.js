import { BaseValue } from '../_lib/BaseClasses';
import { Day } from '../_lib/ValueObjects';

export class Award extends BaseValue {
  constructor({ value, day = new Day() }) {
    super();
    this.value = value;
    this.day = day;
  }
}
