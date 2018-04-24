import { BaseValue } from '../../BaseClasses';
import { Day } from '../Day';
import { makeError } from 'src/infra/support/makeError';

const isValidDay = (day) => day && day.constructor === Day && day.isValid();

export class DayRange extends BaseValue {
  // Errors

  static errorNotADay = Day.errorNotADay;
  static errorNotADate = Day.errorNotADate;
  static errorNotANumber = Day.errorNotANumber;
  static errorNotADayRange = makeError('ValidationError', 'Not A DayRage');

  // Factories

  static createWeek(day) {
    return this._dayRangeFactory(day, 'Week');
  }

  static createMonth(day) {
    return this._dayRangeFactory(day, 'Month');
  }

  static createQuarter(day) {
    return this._dayRangeFactory(day, 'Quarter');
  }

  static createYear(day) {
    return this._dayRangeFactory(day, 'Year');
  }

  static _dayRangeFactory(day = new Day(), rangeName) {
    if (!isValidDay(day)) {
      throw this.errorNotADay;
    }

    return new DayRange({
      start: day[`startOf${rangeName}`](),
      end: day[`endOf${rangeName}`](),
    });
  }

  // Instance methods

  constructor({ start, end } = {}) {
    super();
    this.start = start;
    this.end = end;
  }

  [Symbol.iterator] = function*() {
    if (!this.isValid()) {
      return undefined;
    }
    let curDay = this.start;
    do {
      yield curDay;
      curDay = curDay.addDays(1);
    } while (curDay < this.end);
  };

  get length() {
    if (!this.isValid()) {
      throw this.constructor.errorNotANumber;
    }

    return this.end.difference(this.start) + 1;
  }

  contains(day) {
    if (!this.isValid() && isValidDay(day)) {
      throw this.constructor.errorNotADay;
    }
    return day >= this.start && day <= this.end;
  }

  toString() {
    if (!this.isValid()) {
      return this.constructor.errorNotADayRange.message[0];
    }

    return `${this.start.toString()} - ${this.end.toString()}`;
  }

  valueOf() {
    if (this.isValid()) {
      return NaN;
    }

    return this.end - this.start;
  }

  isValid() {
    return (
      isValidDay(this.start) && isValidDay(this.end) && this.end >= this.start
    );
  }
}
