import { BaseValue } from '../lib';

export class PieceRate extends BaseValue {
  constructor({ value, date }) {
    super();
    this.value = value;
    this.date = date;
  }
}
