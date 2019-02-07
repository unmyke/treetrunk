/* eslint-disable no-underscore-dangle */
import { BaseValue } from '../../_lib';
import { isEqualValues } from '../../_lib/base-methods';

export default class Record extends BaseValue {
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

  get isFirst() {
    return this.isStored && this.prev === undefined;
  }

  setPrev(prev) {
    this._prev = prev;
  }

  setNext(next) {
    this._next = next;
  }

  store({ prev, next }) {
    if (prev !== undefined) {
      this.setPrev(prev);
      prev.setNext(this);
    }

    if (next !== undefined) {
      this.setNext(next);
      next.setPrev(this);
    }

    this._isStored = true;
  }

  unStore() {
    if (this.prev !== undefined) this.prev.setNext(this.next);
    if (this.next !== undefined) this.next.setPrev(this.prev);

    this.setNext();
    this.setPrev();

    this._isStored = false;
  }

  hasEqualNieghbours() {
    return (
      this.prev !== undefined &&
      this.next !== undefined &&
      isEqualValues(this.prev.value, this.next.value)
    );
  }
}
