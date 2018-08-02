import { Day } from '../Day';
import { Record } from './Record';
import { errors } from '../../errors';
import { getDayComparator } from '../../_lib/BaseMethods';

export class Store {
  constructor() {
    this._data = new Map();
  }

  get(day) {
    return this._data.get(day.valueOf());
  }

  getLastDay() {
    const lastKey = Math.max(...this._data.keys());

    return Day.createByInt(lastKey);
  }

  getFirstDay() {
    const firstKey = Math.min(...this._data.keys());

    return Day.createByInt(firstKey);
  }

  get all() {
    return this._data
      .values()
      .map(({ value, day }) => ({ value, day }))
      .sort(getDayComparator('asc', ({ day }) => day));
  }

  set(records) {
    return records.map(({ value, day }) => this.add(value, day));
  }

  add(value, day = new Day()) {
    const key = day.valueOf();

    if (!this._data.has(key)) {
      const newRecord = new Record({ value, day });

      newRecord.store(this.getNeighbors(day));
      this._data.set(key, newRecord);

      return newRecord;
    }

    throw errors.recordAlreadyExists();
  }

  delete(day = new Day()) {
    const key = day.valueOf();

    const recordToDelete = this._data.get(key);

    if (recordToDelete !== undefined) {
      recordToDelete.unStore();
      this._data.delete(key);

      return recordToDelete;
    }

    throw errors.recordNotFound();
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
}
