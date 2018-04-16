import { BaseValue } from '../lib/BaseClasses';
import { addDateAccessors } from '../lib/functions';

export class PieceRate extends BaseValue {
  constructor({ value, date }) {
    super();
    this.value = value;
    this.date = date;
  }
}

addDateAccessors(PieceRate);
