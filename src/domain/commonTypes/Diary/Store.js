import { Day } from '../Day';
import { Record } from './Record';

export class Store {
  constructor() {
    this._data = new Map();
  }

  set(records) {
    records.forEach(({ value, day }) => {
      this.add(value, day);
    });
  }

  get(day) {
    return this._data.get(day.valueOf());
  }

  add(value, day = new Day()) {
    const key = day.valueOf();

    const newRecord = new Record({ value, day });

    const { next, prev } = this.getNeighbors(day);
    if (prev !== undefined) {
      newRecord.setPrev(prev);
      prev.setNext(newRecord);
    }

    if (next !== undefined) {
      newRecord.setNext(next);
      next.setPrev(newRecord);
    }

    newRecord.store();

    this._data.set(key, newRecord);

    return newRecord;
  }

  delete(day = new Day()) {
    const key = day.valueOf();

    const recordToDelete = this._data.get(key);

    if (recordToDelete !== undefined) {
      if (recordToDelete.prev !== undefined)
        recordToDelete.prev.setNext(recordToDelete.next);
      if (recordToDelete.next !== undefined)
        recordToDelete.next.setPrev(recordToDelete.prev);
    }
    recordToDelete.unStore();

    this._data.delete(key);

    return recordToDelete;
  }

  update(day, newValue, newDay) {
    this.delete(day);
    this.add(newValue, newDay);
  }

  get all() {
    return this._data.values().map(({ value, day }) => ({ value, day }));
  }

  getNeighbors(day, { excludeDay } = {}) {
    const key = day.valueOf();

    const neighbors = {};

    for (let currentKey of this._data.keys()) {
      if (excludeDay === undefined || excludeDay.valueOf() === currentKey) {
        const diff = key - currentKey;
        const lastPrevDiff =
          key - (neighbors.prev !== undefined ? neighbors.prev.key : 0);
        const lastNextDiff =
          (neighbors.next !== undefined ? neighbors.next.key : 0) - key;

        if (diff > 0 && diff < lastPrevDiff)
          neighbors.prev = this.get(currentKey);
        if (diff < 0 && diff > lastNextDiff)
          neighbors.next = this.get(currentKey);
      }
    }

    return neighbors;
  }
}
