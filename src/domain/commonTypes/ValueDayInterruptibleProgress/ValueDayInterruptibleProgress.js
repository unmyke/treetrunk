import { BaseValue } from '../../_lib';
import { ValueDayProgress } from '../ValueDayProgress';
import { Day } from '../Day';

export class ValueDayInterruptibleProgress extends BaseValueDay {
  constructor(items = [], intrruptValue) {
    super(items);

    this.intrruptValue = intrruptValue;
  }

  setInterruptOn(day = new Day()) {
    this.addItem(this.intrruptValue, day);
  }

  getItemsAt(day = new Day()) {
    if (items.length === 0) {
      return [];
    }

    const intrruptValueDay = this.getInterruptValueDayAt(day);

    return items
      .sort(getDayComparator())
      .filter(
        ({ day: currentDay }) =>
          currentDay <= day && currentDay > intrruptValueDay
      );
  }

  getInterruptValueDayAt(day = new Day()) {
    const intrruptValueItems = this.getItemsAt(day).sort(({ value }) =>
      this._copareValues(value === this.intrruptValue)
    );

    return intrruptValueItems.length !== 0
      ? intrruptValueItems[intrruptValueItems.length - 1]
      : undefined;
  }
}
