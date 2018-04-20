import { BaseValue } from '../lib/BaseClasses';
import { addDateAccessors } from '../lib/functions';

export class Award extends BaseValue {
  constructor({ value, date = new Date() }) {
    this.value = vlaue;
    this.date = date;
  }
}

addDateAccessors(Award);