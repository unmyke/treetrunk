import { Day } from '../Day';
import { Record } from './Record';
import { errors } from '../../errors';

export class Store {
  constructor() {
    this._data = new Map();
  }

  get(day) {
    return this._data.get(day.valueOf());
  }

  set(records) {
    return records.map(({ value, day }) => this.add(value, day));
  }

  add(value, day = new Day()) {
    const key = day.valueOf();

    if (!this._data.has(key)) {
      const newRecord = new Record({ value, day });

      record.setNeighbors();

      newRecord.storeWithNeighbors(this.getNeighbors(day));

      this._data.set(key, newRecord);

      // console.log('################ add ################');
      // console.log(newRecord);
      return newRecord;
    }

    throw errors.recordAlreadyExists();
  }

  delete(day = new Day()) {
    const key = day.valueOf();

    const recordToDelete = this._data.get(key);

    if (recordToDelete !== undefined) {
      if (recordToDelete.prev !== undefined)
        recordToDelete.prev.setNext(recordToDelete.next);
      if (recordToDelete.next !== undefined)
        recordToDelete.next.setPrev(recordToDelete.prev);

      recordToDelete.unStore();

      this._data.delete(key);

      return recordToDelete;
    }

    return errors.recordNotFound();
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
