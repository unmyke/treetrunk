import { Day } from '../day';
import { Record } from './record';
import { errors } from '../../errors';
import { isEqualValues } from '../../_lib/base-methods';

const { map, filter, reduce } = Array.prototype;

export class Store {
  static clone({ _data }) {
    const store = new Store();
    store._data = new Map([..._data]);

    return store;
  }

  static restore(data) {
    const store = new Store();
    store._data = data;

    return store;
  }

  constructor() {
    this._data = new Map();
  }

  get first() {
    return this._data.get(this._getFirstKey());
  }

  get firstDay() {
    const first = this.first;
    return first !== undefined ? first.day : undefined;
  }

  get last() {
    return this._data.get(this._getLastKey());
  }

  get lastDay() {
    const last = this.last;
    return last !== undefined ? last.day : undefined;
  }

  get records() {
    return [...this._data.entries()]
      .sort(([keyA], [keyB]) => keyA - keyB)
      .map(([, { value, day }]) => ({ value, day }));
  }

  get size() {
    return this._data.size;
  }

  get(day) {
    return this._data.get(day.valueOf());
  }

  add(value, day = new Day()) {
    const key = day.valueOf();

    if (this._data.has(key)) {
      throw errors.recordAlreadyExists();
    }

    const newRecord = new Record({ value, day });

    newRecord.store(this.getNeighbours(day));
    this._data.set(key, newRecord);

    return {
      value,
      day,
    };
  }

  delete(day = new Day()) {
    const key = day.valueOf();

    const recordToDelete = this._data.get(key);

    if (recordToDelete === undefined) {
      throw errors.recordNotFound();
    }

    recordToDelete.unStore();
    this._data.delete(key);

    return {
      value: recordToDelete.value,
      day: day,
    };
  }

  update(day, newValue, newDay) {
    this.delete(day);
    this.add(newValue, newDay);

    return {
      value: newValue,
      day: newDay,
    };
  }

  set(data) {
    data.forEach(({ value, day }) => {
      this.add(value, day);
    });
  }

  getNeighbours(day, { excludeDay } = {}) {
    const key = day.valueOf();

    const neighbors = {};

    for (let currentKey of this._data.keys()) {
      if (excludeDay === undefined || excludeDay.valueOf() !== currentKey) {
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

    neighbors.equal = function(value) {
      return (
        (this.prev !== undefined && isEqualValues(this.prev.value, value)) ||
        (this.next !== undefined && isEqualValues(this.next.value, value))
      );
    };

    neighbors.isExists = function() {
      return this.prev !== undefined && this.next !== undefined;
    };

    return neighbors;
  }

  map(callback) {
    return this._highOrderFunctionDispatcher(map, (record) => callback(record));
  }

  reduce(callback, initValue) {
    return this._highOrderFunctionDispatcher(
      reduce,
      (record) => callback(record),
      initValue
    );
  }

  filter(callback) {
    const store = new Store();

    const data = new Map(
      this._highOrderFunctionDispatcher(filter, (record) =>
        callback(record)
      ).map(({ value, day }) => [day.valueOf(), value])
    );
    store._data = data;

    return store;
  }

  _highOrderFunctionDispatcher(method, ...args) {
    const array = [...this._data].map(([day, value]) => ({
      value,
      day: Day.createByInt(day),
    }));

    return method.call(array, ...args);
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
