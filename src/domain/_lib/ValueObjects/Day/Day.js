import {
  format as formatFNS,
  startOfWeek as startOfWeekFNS,
  endOfWeek as endOfWeekFNS,
  startOfMonth as startOfMonthFNS,
  endOfMonth as endOfMonthFNS,
  startOfQuarter as startOfQuarterFNS,
  endOfQuarter as endOfQuarterFNS,
  startOfYear as startOfYearFNS,
  endOfYear as endOfYearFNS,
  differenceInMonths as differenceInMonthsFNS,
  addDays as addDaysFNS,
  subDays as subDaysFNS,
} from 'date-fns';

const ru = require('date-fns/locale/ru');

import { BaseValue } from '../../BaseClasses';
import { isValidDate, convertDate } from 'src/infra/support/dateHelpers';
import { addErrorDefinitionProperty } from 'src/infra/support/addErrorDefinition';

function isMinusZero(value) {
  if (value !== 0) {
    return false;
  }

  return 1 / value === -Infinity;
}

export class Day extends BaseValue {
  // Factories

  static createStartOfWeek(date) {
    return this._dayFactory(date, startOfWeekFNS, { weekStartsOn: 1 });
  }

  static createEndOfWeek(date) {
    return this._dayFactory(date, endOfWeekFNS, { weekStartsOn: 1 });
  }

  static createStartOfMonth(date) {
    return this._dayFactory(date, startOfMonthFNS);
  }

  static createEndOfMonth(date) {
    return this._dayFactory(date, endOfMonthFNS);
  }

  static createStartOfQuarter(date) {
    return this._dayFactory(date, startOfQuarterFNS);
  }

  static createEndOfQuarter(date) {
    return this._dayFactory(date, endOfQuarterFNS);
  }

  static createStartOfYear(date) {
    return this._dayFactory(date, startOfYearFNS);
  }

  static createEndOfYear(date) {
    return this._dayFactory(date, endOfYearFNS);
  }

  static _dayFactory(date = new Date(), dateGetter, dateGetterProps) {
    if (!isValidDate(date)) {
      throw this.errorNotADate;
    }

    return new Day({ value: dateGetter(date, dateGetterProps) });
  }

  //Validator

  static isValid(day) {
    return day && day.constructor === Day && day.isValid();
  }

  // Instance methods

  constructor({ value } = { value: new Date() }) {
    super();
    this.value = convertDate(value);
  }

  contains(date) {
    if (!isValidDate(date)) {
      throw this.constructor.errorNotADay;
    }

    return convertDate(date).valueOf() === this.valueOf();
  }

  format(formatString = 'DD.MM.YYYY') {
    if (!this.isValid()) {
      return this.constructor.errorNotADay.details[0];
    }

    return formatFNS(this.value, formatString, { locale: ru });
  }

  addDays(num = 0) {
    if (typeof num !== 'number') {
      throw this.constructor.errorNotANumber;
    }

    return new Day({ value: addDaysFNS(this.value, num) });
  }

  subDays(num = 0) {
    if (typeof num !== 'number') {
      throw this.constructor.errorNotANumber;
    }

    return new Day({ value: subDaysFNS(this.value, num) });
  }

  difference(day) {
    if (day.constructor !== this.constructor || !day.isValid()) {
      throw this.constructor.errorNotADay;
    }

    return parseInt((this - day) / 86400000);
  }

  differenceInMonths(day) {
    if (day.constructor !== this.constructor || !day.isValid()) {
      throw this.constructor.errorNotADay;
    }

    const result = differenceInMonthsFNS(this.value, day.value);
    return isMinusZero(result) ? -result : result;
  }

  startOfWeek() {
    return this.constructor.createStartOfWeek(this.value);
  }

  endOfWeek() {
    return this.constructor.createEndOfWeek(this.value);
  }

  startOfMonth() {
    return this.constructor.createStartOfMonth(this.value);
  }

  endOfMonth() {
    return this.constructor.createEndOfMonth(this.value);
  }

  startOfQuarter() {
    return this.constructor.createStartOfQuarter(this.value);
  }

  endOfQuarter() {
    return this.constructor.createEndOfQuarter(this.value);
  }

  startOfYear() {
    return this.constructor.createStartOfYear(this.value);
  }

  endOfYear() {
    return this.constructor.createEndOfYear(this.value);
  }

  next() {
    return this.addDays(1);
  }

  prev() {
    return this.subDays(1);
  }

  toString() {
    if (!this.isValid()) {
      return this.constructor.errorNotADay.message[0];
    }

    return this.format(this.value);
  }

  valueOf() {
    if (!this.isValid()) {
      return NaN;
    }

    return this.value.getTime();
  }

  isValid() {
    return isValidDate(this.value);
  }
}

addErrorDefinitionProperty(
  Day,
  'errorNotADate',
  'ValidationError',
  'Not A Date'
);
addErrorDefinitionProperty(Day, 'errorNotADay', 'ValidationError', 'Not A Day');
addErrorDefinitionProperty(
  Day,
  'errorNotANumber',
  'ValidationError',
  'Not A Number'
);
