export class Archive {
  constructor() {
    this._data = new Map();

    this._lastKey = undefined;
  }

  get last() {
    return this._data(this._lastKey);
  }

  add(day, store) {
    this._data.set(day.valueOf, store);

    this._memoize();
  }

  restoreLast() {
    const last = this.last;
    this._data.delete(this._lastKey);

    this._memoize();
    return last;
  }

  _memoize() {
    const lastKey = Math.max(...this._data.keys());

    if (lastKey !== this._lastKey) this._lastKey = lastKey;
  }
}
