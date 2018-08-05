import { Day } from '../Day';

export class Archive {
  constructor() {
    this._data = new Map();
  }

  get last() {
    return this._data.get(this._getLastKey);
  }

  get lastDay() {
    return Day.createByInt(this._getLastKey);
  }

  add(day, store) {
    this._data.set(day.valueOf, store);
  }

  restoreLast() {
    const last = this.last;
    this._data.delete(this._getLastKey);

    return last;
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
