import { BaseValue } from '../../_lib';

export class Record extends BaseValue {
  constructor({ value, day }) {
    this.value = value;
    this.day = day;

    this.prev = undefined;
    this.next = undefined;
    this.isStored = false;
    this.isClose = false;
  }
}
