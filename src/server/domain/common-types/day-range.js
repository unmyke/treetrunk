/* eslint-disable no-underscore-dangle */
import { BaseValue } from '../_lib';
import Day from './day';
// import { addErrorDefinitionProperty } from '@infra/support/addErrorDefinition';

export default class DayRange extends BaseValue {
  // Errors

  // static errorNotADay = Day.errorNotADay;
  // static errorNotADate = Day.errorNotADate;
  // static errorNotANumber = Day.errorNotANumber;

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
    // if (!Day.isValid(day)) {
    //   throw this.errorNotADay;
    // }

    return new DayRange({
      start: day[`startOf${rangeName}`](),
      end: day[`endOf${rangeName}`](),
    });
  }

  // Validator

  static isValid(dayRange) {
    return (
      dayRange &&
      dayRange.constructor === DayRange &&
      Day.isValid(dayRange.start) &&
      Day.isValid(dayRange.end) &&
      dayRange.end >= dayRange.start
    );
  }

  // Instance methods

  constructor({ start, end } = {}) {
    super();
    this._start = start;
    this._end = end;
  }

  [Symbol.iterator] = function* iterator() {
    let curDay = this.start;
    do {
      yield curDay;
      curDay = curDay.addDays(1);
    } while (curDay < this.end);
  };

  get start() {
    return this._start;
  }

  get end() {
    return this._end;
  }

  get length() {
    // if (!this.isValid()) {
    //   throw this.constructor.errorNotANumber;
    // }

    return this.end.difference(this.start) + 1;
  }

  contains(day) {
    // if (!this.isValid() && Day.isValid(day)) {
    //   throw this.constructor.errorNotADay;
    // }
    return day >= this.start && day <= this.end;
  }

  toString() {
    // if (!this.isValid()) {
    //   return this.constructor.errorNotADayRange.message[0];
    // }

    return `${this.start.toString()} - ${this.end.toString()}`;
  }

  valueOf() {
    // if (this.isValid()) {
    //   return NaN;
    // }

    return this.end - this.start;
  }

  // isValid() {
  //   return (
  //     Day.isValid(this.start) && Day.isValid(this.end) && this.end >= this.start
  //   );
  // }
  toJSON() {
    return {
      startDate: this.start.toJSON(),
      endDate: this.end.toJSON(),
    };
  }
}

// addErrorDefinitionProperty(
//   DayRange,
//   'errorNotADayRange',
//   'ValidationError',
//   'Not A DayRage'
// );
