import { BaseValue } from '../../_lib';
import { DayRange } from '../DayRange';

export class BaseDayRangeMetric extends BaseValue {
  constructor({ value, dayRange = new DayRange() }) {
    super();
    this.value = value;
    this.dayRange = dayRange;
  }
}
