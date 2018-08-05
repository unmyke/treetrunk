import { Day } from '../Day';
import { Record } from './Record';
import { errors } from '../../errors';
import { getDayComparator } from '../../_lib/BaseMethods';

export class Store {
  constructor() {
    this._data = new Map();
  }

  get first() {
    return this._data.get(this._getFirstKey);
  }

  get last() {
    return this._data.get(this._getLastKey);
  }

  get all() {
    return [...this._data.entries()]
      .sort(([keyA], [keyB]) => keyA - keyB)
      .map(([key, { value, day }]) => ({ value, day }));
    // return [...this._data.values()]
    //   .map(({ value, day }) => ({ value, day }))
    //   .sort(getDayComparator('asc', ({ day }) => day));
  }

  get(day) {
    return this._data.get(day.valueOf());
  }

  set(records) {
    return records.map(({ value, day }) => this.add(value, day));
  }

  add(value, day = new Day()) {
    const key = day.valueOf();

    if (this._data.has(key)) {
      throw errors.recordAlreadyExists();
    }

    const newRecord = new Record({ value, day });

    newRecord.store(this.getNeighbors(day));
    this._data.set(key, newRecord);

    return newRecord;
  }

  delete(day = new Day()) {
    const key = day.valueOf();

    const recordToDelete = this._data.get(key);

    if (recordToDelete === undefined) {
      throw errors.recordNotFound();
    }

    recordToDelete.unStore();
    this._data.delete(key);

    return recordToDelete;
  }

  update(day, newValue, newDay) {
    this.delete(day);
    this.add(newValue, newDay);
  }

  getNeighbors(day, { excludeDay } = {}) {
    const key = day.valueOf();

    const neighbors = {};

    for (let currentKey of this._data.keys()) {
      if (excludeDay === undefined || excludeDay.valueOf() === currentKey) {
        const diff = currentKey - key;

        if (diff < 0) {
          const lastPrevDiff =
            (neighbors.prev !== undefined ? neighbors.prev.key : 0) - key;

          if (diff > lastPrevDiff) neighbors.prev = this.get(currentKey);
        }

        if (diff > 0) {
          const lastNextDiff =
            (neighbors.next !== undefined ? neighbors.next.key : Infinity) -
            key;

          if (diff < lastNextDiff) neighbors.next = this.get(currentKey);
        }
      }
    }

    return neighbors;
  }

  _getFirstKey() {
    const min = Math.min(...this._data.keys());

    return min !== Infinity ? min : undefined;
  }

  _getLastKey() {
    const max = Math.max(...this._data.keys());

    return max !== -Infinity ? max : undefined;
  }
}
