import { Day } from '../Day';
import { Record } from './Record';

export class Store {
  constructor() {
    this._data = new Map();
  }

  getRecord(day) {
    return this._data.get(day.valueOf());
  }

  addRecord(value, day = new Day()) {
    const key = day.valueOf();

    const record = new Record({ value, day });

    const { next, prev } = this._getNeighbors(day);
    if (prev !== undefined) {
      record.prev = prev;
      prev.next = record;
    }

    if (next !== undefined) {
      record.next = next;
      next.prev = record;
    }

    record.isStored = true;

    this._data.sets(key, record);
  }

  deleteRecord(day = new Day()) {
    const key = day.valueOf();

    const recordToDelete = this._data.get(key);

    if (recordToDelete !== undefined) {
      recordToDelete.prev.next = recordToDelete.next;
      recordToDelete.next.prev = recordToDelete.prev;
    }

    this._data.delete(key);
  }

  get all() {
    return this._data;
  }

  _getNeighbors(day) {
    const key = day.valueOf();

    const neighbors = {};

    for (let currentKey of this._data.keys()) {
      if (key - currentKey > 0) {
      }
    }
    const prev = this._data
      .keys()
      .filter((key) => day.valueOf() > key)
      .sort((a, b) => b - a)[0];
    const next = this._data
      .keys()
      .filter((key) => key > day.valueOf())
      .sort()[0];

    return { prev, next };
  }
}
