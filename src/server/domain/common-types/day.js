/* eslint-disable no-underscore-dangle */
import {
  formatWithOptions as formatFNS,
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
  parseISO,
} from 'date-fns/fp';
import { ru } from 'date-fns/locale';

import { isValidDate, convertDate } from '@infra/support/date-helpers';
import { BaseValue } from '../_lib';

function isMinusZero(value) {
  if (value !== 0) {
    return false;
  }

  return 1 / value === -Infinity;
}

export default class Day extends BaseValue {
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
    return new Day({ value: dateGetter(dateGetterProps)(date) });
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
    return new Day({ value: addDaysFNS(num)(this.value) });
  }

  subDays(num = 0) {
    return new Day({ value: subDaysFNS(num)(this.value) });
  }

  addMonths(num = 0) {
    return new Day({ value: addMonthsFNS(num)(this.value) });
  }

  subMonths(num = 0) {
    return new Day({ value: subMonthsFNS(num)(this.value) });
  }

  difference(day = new Day()) {
    return parseInt((this - day) / (24 * 60 * 60 * 1000), 10);
  }

  differenceInMonths(day = new Day()) {
    const result = differenceInMonthsFNS(day.value)(this.value);
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
    console.log(this.value);
    return formatFNS({ locale: ru }, formatString)(this.value);
  }

  toString() {
    return this.format('dd.MM.yyyy');
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
