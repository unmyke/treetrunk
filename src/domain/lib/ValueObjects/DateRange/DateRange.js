import { format, differenceInDays, addDays } from 'date-fns';
import { isValidDate, convertDate } from 'src/infra/support/dateHelpers';
import { BaseValue } from '../../BaseClasses';

export class DateRange extends BaseValue {
  constructor({ start, end } = {}) {
    super();
    this.start = start;
    this.end   = end;
  }

  [Symbol.iterator] = function* () {
    if (!this.isValid()) {
      return undefined;
    }
    let curDate = this.start;
    do {
      yield curDate;
      curDate = addDays(curDate, 1);
    } while(curDate < this.end);
  }

  get start() {
    return this._start;
  }

  get end() {
    return this._end;
  }

  set start(date) {
    this._start = convertDate(date);
  }

  set end(date) {
    this._end = convertDate(date);
  }

  get length() {
    if (!this.isValid()) {
      return 0;
    }
    return differenceInDays(this.end, this.start) + 1;
  }

  contains(rawDate) {
    if (!this.isValid()) {
      return false;
    }
    const date = convertDate(rawDate);
    return  date >= this.start && date <= this.end;
  }

  toString() {
    if (!this.isValid()) {
      return 'Invalid DateRange';
    }

    return `${format('DD.MM.YYYY', this.start)} - ${format('DD.MM.YYYY', this.end)}`;
  }

  valueOf() {
    if (this.isValidDate()) {
      return NaN;
    }

    return this.end - this.start;
  }

  isValid() {
    return isValidDate(this.start) && isValidDate(this.end) && this.end >= this.start;
  }
}
