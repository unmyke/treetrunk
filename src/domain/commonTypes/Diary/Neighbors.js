import { isEqualValues } from '../../_lib/BaseMethods';

export class Neighbors {
  static create(day, records, valuePropName, { excludeDay } = {}) {
    const neighbors = records.reduce((neighbors, currentRecord) => {
      const newNeighbors = { ...neighbors };

      if (excludeDay === undefined || !currentRecord.day.equals(excludeDay)) {
        if (currentRecord.day < day) newNeighbors.prev = currentRecord;
        if (currentRecord.day > day) newNeighbors.next = currentRecord;
      }

      return newNeighbors;
    }, {});

    neighbors.valuePropName = valuePropName;
    return new Neighbors(neighbors);
  }

  constructor({ prev, next, valuePropName }) {
    this.prev = prev;
    this.next = next;
    this.valuePropName = valuePropName;
  }

  isExist() {
    return this.prev !== undefined && this.next !== undefined;
  }

  isEqual() {
    return (
      this.isExist &&
      isEqualValues(
        this.prev[this.valuePropName],
        this.next[this.valuePropName]
      )
    );
  }

  isEqualTo(value) {
    return (
      (this.prev !== undefined &&
        isEqualValues(value, this.prev[this.valuePropName])) ||
      (this.next !== undefined &&
        !isEqualValues(value, this.next[this.valuePropName]))
    );
  }
}
