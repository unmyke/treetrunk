import { BaseValue } from '../../_lib';

export class Record extends BaseValue {
  static CLOSE_VALUE = null;

  static getCloseValue(day = new Day()) {
    return new Record({ value: CLOSE_VALUE, day });
  }

  constructor({ value, day }) {
    super();
    this._value = value;
    this._day = day;
    this._isStored = false;

    this._prev = undefined;
    this._next = undefined;
  }

  get value() {
    return this._value;
  }

  get day() {
    return this._day;
  }

  get key() {
    return this._day.valueOf();
  }

  get prev() {
    return this._prev;
  }

  get next() {
    return this._next;
  }

  get isStored() {
    return this._isStored;
  }

  get isLast() {
    return this.isStored && this.next === undefined;
  }

  get isClose() {
    return this._value === this.constructor.CLOSE_VALUE;
  }

  setNeighbors({ prev, next }) {
    if (prev !== undefined) {
      this._setPrev(prev);
      prev._setNext(this);
    }

    if (next !== undefined) {
      this._setNext(next);
      next._setPrev(this);
    }

    this.store();
  }

  setPrev(prev) {
    this._prev = prev;
  }

  setNext(next) {
    this._next = next;
  }

  store() {
    this._isStored = true;
  }

  unStore() {
    this._setNext();
    this._setPrev();
    this._isStored = false;
  }
}
