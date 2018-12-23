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
  addMonths as addMonthsFNS,
  subMonths as subMonthsFNS,
} from 'date-fns';

const ru = require('date-fns/locale/ru');

import { BaseValue } from '../../_lib';
import { isValidDate, convertDate } from 'src/infra/support/date-helpers';

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

  static createByInt(int) {
    return new Day({ value: new Date(int) });
  }

  static _dayFactory(date = new Date(), dateGetter, dateGetterProps) {
    return new Day({ value: dateGetter(date, dateGetterProps) });
  }

  // Validator

  static isValid(day) {
    return day && day.constructor === Day && isValidDate(day.value);
  }

  // Instance methods

  constructor({ value } = { value: new Date() }) {
    super();
    this._value = convertDate(value);
  }

  get value() {
    return this._value;
  }

  contains(date) {
    return convertDate(date).valueOf() === this.valueOf();
  }

  addDays(num = 0) {
    return new Day({ value: addDaysFNS(this.value, num) });
  }

  subDays(num = 0) {
    return new Day({ value: subDaysFNS(this.value, num) });
  }

  addMonths(num = 0) {
    return new Day({ value: addMonthsFNS(this.value, num) });
  }

  subMonths(num = 0) {
    return new Day({ value: subMonthsFNS(this.value, num) });
  }

  difference(day = new Day()) {
    return parseInt((this - day) / 86400000);
  }

  differenceInMonths(day = new Day()) {
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

  format(formatString) {
    return formatFNS(this.value, formatString, { locale: ru });
  }

  toString() {
    return this.format('DD.MM.YYYY');
  }

  valueOf() {
    return this.value.getTime();
  }

  equals(day) {
    if (!(day instanceof Day)) {
      return false;
    }

    return this.valueOf() === day.valueOf();
  }

  toJSON() {
    return this.format();
  }
}
