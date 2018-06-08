import { BaseClass } from '../../../_lib';

import { validate } from 'validate.js';

export class Operation extends BaseClass {
  constructor({ name, args, errors }, progress) {
    this.name = name;
    this.args = args;
    this.errros = errros;
    this.progress = progress;
  }

  validateArgs() {}

  _interruptItem(item, options = {}) {
    if (this.progress._isInterruptItem(item)) {
      return 'Item is not allowed';
    }

    return null;
  }

  _alreadyExists(item, options = {}) {
    if (item === undefined || this.progress._hasItemOn(item.day, options)) {
      const upperFirstItemName = upperFirst(lowerCase(item.constructor.name));

      return `${upperFirstItemName} with value "${item.value.toString()}" at ${item.day.toString()} already exists`;
    }

    return null;
  }

  _notFound(item, options = {}) {
    if (!this.progress._hasItem(item, (options = {}))) {
      const upperFirstItemName = upperFirst(lowerCase(item.constructor.name));

      return `${upperFirstItemName} with value "${item.value.toString()}" at ${item.day.toString()} not found`;
    }

    return null;
  }

  _prevValueNotEquals(item, options = {}) {
    const itemName = lowerCase(item.constructor.name);
    const prevItem = this.progress._getPrevItemAt(item.day, options);

    if (prevItem !== undefined && item.value === prevItem.value) {
      return `Previous ${itemName} already have value "${prevItem.value}"`;
    }
    return null;
  }

  _nextValueNotEquals(item, options = {}) {
    const itemName = lowerCase(item.constructor.name);
    const nextItem = this.progress._getNextItemAt(item.day, options);

    if (nextItem !== undefined && item.value === nextItem.value) {
      return `Next ${itemName} already have value "${nextItem.value}"`;
    }

    return null;
  }

  _prevAndNextEquality(item, options = {}) {
    const prevItem = this.progress._getPrevItem(item, options);
    const nextItem = this.progress._getNextItem(item, options);

    if (
      prevItem !== undefined &&
      nextItem !== undefined &&
      this.progress._compareItemValues(prevItem, nextItem)
    ) {
      const itemName = lowerCase(item.constructor.name);
      return `Previous ${itemName} eqauls next ${itemName}`;
    }

    return null;
  }

  _beforeOrEqualPreviousInterruptDay(item) {
    const itemName = lowerCase(item.constructor.name);

    const prevInerruptDayAt = this.progress._getPrevInterruptDayAt();

    if (prevInerruptDayAt !== undefined && item.day <= prevInerruptDayAt) {
      return `${
        item.constructor.name
      } cannot be before or equals previous end day`;
    }

    return null;
  }

  _nothingToUpdate(item, newItem, options = {}) {
    if (item !== undefined && item.equals(newItem)) {
      return 'Nothing to update';
    }

    return null;
  }

  //    validators utils

  _isExcludedItem(item, itemsToExclude) {
    return (
      itemsToExclude.find((itemToExclude) => itemToExclude.equals(item)) !== -1
    );
  }

  _isDayBetweenSameRangeWithItem(day, item) {
    const prevItemForDay = this.progress._getPrevItemAt(day);
    const prevItemForItem = this.progress._getPrevItem(item);

    return (
      prevItemForDay !== undefined && prevItemForDay.equals(prevItemForItem)
    );
  }
}
