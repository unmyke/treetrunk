import { lowerFirst, lowerCase, upperFirst, upperCase } from 'lodash';

import { applyFSM, getDayComparator } from '../../_lib/BaseMethods';
import { BaseClass, BaseValue } from '../../_lib';

import { Day } from '../Day';

import { Operation as ErrorFactory } from 'src/infra/errorFactories';
import { REFUSED } from 'dns';

export class ValueDayProgress extends BaseClass {
  static errorFactory = new ErrorFactory();

  // FSM
  static fsm = {
    init: 'idle',

    transitions: [
      { name: 'operate', from: 'idle', to: 'validation' },
      {
        name: 'process',
        from: 'validation',
        to: ValueDayProgress.getPostValidationState,
      },
      { name: 'reset', from: ['result', 'error'], to: 'idle' },
    ],

    methods: {
      onValidation(lifecycle, operation) {
        this.operation = { ...operation, errors: [] };

        this._validation(operation.args);
      },

      onResult() {
        const primitiveOperationName = `_${this.operation.name}`;

        this[primitiveOperationName](this.operation.args);
        return {
          done: true,
          error: null,
        };
      },

      onError() {
        return {
          done: false,
          error: this.operation.errors,
        };
      },
    },
  };

  // state-transition functions
  static getPostValidationState() {
    if (this.operation.errors.length === 0) {
      return 'result';
    }
    return 'error';
  }

  constructor({ interruptValue, ItemClasss } = {}) {
    super();
    this._interruptValue = interruptValue;
    this.ItemClasss = ItemClasss;

    this._items = [];

    applyFSM(this.constructor);
    this._fsm();
  }

  // getters

  //  public metods
  get interruptValue() {
    return this._interruptValue;
  }

  get items() {
    return this.getItemsAt();
  }

  get hasItems() {
    return this.hasItemsAt();
  }

  get itemValue() {
    return this.getItemValueAt();
  }

  get itemValues() {
    return this.getItemValuesAt();
  }

  get startDay() {
    return this.getStartDayAt();
  }

  get isStarted() {
    return this.isStartedAt();
  }

  get interruptDay() {
    return this.getInterruptDayAt();
  }

  get isInterrupted() {
    return this.isInterruptedAt(day);
  }

  getItemsAt(day = new Day(), options = {}) {
    return this._getItemsContainsDay(day, options).filter(
      ({ day: currentDay }) => currentDay <= day
    );
  }

  hasItemsAt(day = new Day()) {
    return this.getItemsAt(day).length !== 0;
  }

  getItemValueAt(day = new Day()) {
    const item = this._getItemAt(day);

    return item !== undefined ? item.value : undefined;
  }

  getItemValuesAt(day = new Day(), options = {}) {
    return this.getItemsAt(day, options).map(({ value }) => value);
  }

  getStartDayAt(day = new Day(), options = {}) {
    const items = this.getItemsAt(day, options);

    if (items.length === 0) {
      return;
    }

    return items[0].day;
  }

  isStartedAt(day = new Day()) {
    const startDay = this.getStartDayAt(day);
    return !!startDay;
  }

  getInterruptDayAt(day = new Day()) {
    if (this._isInterruptDay(day)) {
      return day;
    }

    return this._getItemAt(day) === undefined
      ? this._getPrevInterruptDayAt(day)
      : undefined;
  }

  isInterruptedAt(day = new Day()) {
    return !!this.getInterruptDayAt(day);
  }

  //  private metods
  _hasItemOn(day = new Day(), options = {}) {
    const persistedItem = this._getItemOn(day, options);
    return !!persistedItem;
  }

  _hasItem(item, options = {}) {
    if (item === undefined) {
      return;
    }

    const persistedItem = this._getItemOn(item.day, options);
    return persistedItem !== undefined && item.equals(persistedItem);
  }

  _getItemAt(day = new Day(), options = {}) {
    const itemsAt = this.getItemsAt(day, options);

    return itemsAt[itemsAt.length - 1];
  }

  _getPrevItem(item, options = {}) {
    if (item === undefined) {
      return;
    }

    return this._getPrevItemAt(item.day, options);
  }

  _getNextItem(item, options = {}) {
    if (item === undefined) {
      return;
    }

    return this._getNextItemAt(item.day, options);
  }

  _getPrevItemAt(day = new Day(), options = {}) {
    const itemsBeforeDay = this._getItemsBeforeDay(day, options);

    return itemsBeforeDay[itemsBeforeDay.length - 1];
  }

  _getNextItemAt(day = new Day(), options = {}) {
    const itemsAfterDay = this._getItemsAfterDay(day, options);

    return itemsAfterDay[0];
  }

  _getItemsBeforeDay(day = new Day(), options = {}) {
    return this._getItemsContainsDay(day.prev()).filter(
      ({ day: currentDay }) => currentDay < day
    );
  }

  _getItemsAfterDay(day = new Day(), options = {}) {
    return this._getItemsContainsDay(day.next(), options).filter(
      ({ day: currentDay }) => currentDay > day
    );
  }

  _hasItemsBeforeDay(day = new Day(), options = {}) {
    console.log(this._getItemsBeforeDay(day, options));
    console.log(this._getItemsBeforeDay(day, options).length !== 0);
    return this._getItemsBeforeDay(day, options).length !== 0;
  }

  _hasItemsAfterDay(day = new Day(), options = {}) {
    return this._getItemsAfterDay(day, options).length !== 0;
  }

  _getItemsContainsDay(day = new Day(), options = {}) {
    if (this._items.length === 0) {
      return [];
    }

    const prevInterruptDay = this._getPrevInterruptDayAt(day);
    const nextInterruptDay = this._getNextInterruptDayAt(day);

    return this._items.sort(getDayComparator('asc')).filter((item) => {
      return (
        !this._isInterruptDay(day) &&
        (prevInterruptDay === undefined || item.day > prevInterruptDay) &&
        (nextInterruptDay === undefined || item.day < nextInterruptDay) &&
        (options.excludeItems === undefined ||
          !this._isExcludedItem(item, options.excludeItems))
      );
    });
  }

  _isInterruptDay(day = new Day()) {
    const item = this._getItemOn(day);

    if (item !== undefined && this._isInterruptItem(item)) {
      return true;
    }

    return false;
  }

  _isInterruptItem(item) {
    if (item === undefined) {
      return false;
    }

    return this._isInterruptDay(item.day);
  }

  _getPrevInterruptDayAt(day = new Day()) {
    const interruptItems = this._getInterruptItems();

    return interruptItems
      .sort(getDayComparator('asc'))
      .reduce((interruptDay, { day: currentInterruptDay }) => {
        return currentInterruptDay < day ? currentInterruptDay : interruptDay;
      }, undefined);
  }

  _getNextInterruptDayAt(day = new Day()) {
    const interruptItems = this._getInterruptItems();

    return interruptItems
      .sort(getDayComparator('desc'))
      .reduce((interruptDay, { day: currentInterruptDay }) => {
        return currentInterruptDay > day ? currentInterruptDay : interruptDay;
      }, undefined);
  }

  _getInterruptItems() {
    if (this.interruptValue === undefined) {
      return [];
    }

    return this._items.filter(({ value }) =>
      this._compareValues(value, this.interruptValue)
    );
  }

  _getItemOn(day = new Day(), options = {}) {
    return this._items.find((item) => item.day.equals(day));
  }

  _isInterruptItem(item) {
    if (item === undefined) {
      return false;
    }

    return this._compareItemValues(item.value, this.interruptValue);
  }

  //  utils
  _compareItemValues(item1, item2) {
    return (
      item1 !== undefined &&
      item2 !== undefined &&
      this._compareValues(item1.value, item2.value)
    );
  }

  _compareValues(value1, value2) {
    if (value1 instanceof BaseValue) {
      return value1.equals(value2);
    }

    return value1 === value2;
  }

  // operations

  //  public methods
  setItems(newItems = []) {
    return this._emit({ name: 'set', args: { newItems } });
  }

  addItem(item) {
    return this._emit({ name: 'add', args: { item } });
  }

  deleteItem(item) {
    return this._emit({ name: 'delete', args: { item } });
  }

  editItem(item, newItem) {
    return this._emit({ name: 'edit', args: { item, newItem } });
  }

  addInterrupt(day) {
    return this._emit({ name: 'addInterrupt', args: { day } });
  }

  map(fn) {
    return this.items.map(fn);
  }

  reduce(fn) {
    return this.items.reduce(fn);
  }

  filter(fn) {
    return this.items.filter(fn);
  }

  //  private methods

  //    operation runner
  _emit(operation) {
    this.operate(operation);
    const result = this.process();
    this.reset();
    return result;
  }

  //    primitive oparations
  _set({ newItems }) {
    this._items = [...newItems];
  }

  _add({ item }) {
    this._items = [...this._items, item];
  }

  _delete({ item }) {
    this._items = this._items.filter(
      (currentItem) => !item.equals(currentItem)
    );
  }

  _edit({ item, newItem }) {
    this._delete({ item });
    this._add({ item: newItem });
  }

  _addInterrupt({ day }) {
    const interruptItem = new this.ItemClass({
      value: this.interruptValue,
      day,
    });

    this._add({ item: interruptItem });
  }

  //    validation runner
  _validation(args) {
    const validationMethod = `_validate${upperFirst(
      this.operation.name
    )}Operation`;

    this[validationMethod](args);
  }

  //    validation setters
  _validateAddOperation({ item }, options = {}) {
    this.operation.errors = this._getAddErrors({ item }, options);
  }

  _validateDeleteOperation({ item }, options = {}) {
    this.operation.errors = this._getDeleteErrors({ item }, options);
  }

  _validateEditOperation({ item, newItem }, options = {}) {
    this.operation.errors = this._getEditErrors({ item, newItem }, options);
  }

  _validateSetOperation({ items }, options = {}) {
    this.operation.errors = [];
  }

  _validateAddInterruptOperation({ items }, options = {}) {
    this.operation.errors = this._getInterruptErrors({ day }, options);
  }

  //    validation error generators
  _getAddErrors({ item }, options = {}) {
    const errors = {};

    const alreadyExistsError = this._getAlreadyExistsError(item, options);

    if (alreadyExistsError !== null) {
      error.item = [alreadyExistsError];
    } else {
      const prevOrNextValuesNotEqualPassedItemValueErrors = this._collectErrors(
        this._getPrevValueNotEqualsError(item, options),
        this._getNextValueNotEqualsError(item, options)
      );

      if (prevOrNextValuesNotEqualPassedItemValueErrors.length !== 0) {
        error.item = prevOrNextValuesNotEqualPassedItemValueErrors;
      } else {
        const notInCurrentItemsError = this._getNotInCurrentItemsError(item);

        if (notInCurrentItemsError !== null) {
          errors.item = [notInCurrentItemsError];
        }
      }
    }

    return errors;
  }

  _getAddInterruptErrors({ day }, options = {}) {
    const interruptItem = new this.ItemClass({
      value: this.interruptValue,
      day,
    });

    return this._collectErrors(
      this._getAlreadyExistsError(interruptItem, options),
      this._getPrevValueNotEqualsError(interruptItem, options),
      this._getNextValueNotEqualsError(interruptItem, options)
    );
  }

  _getDeleteErrors({ item }, options = {}) {
    return this._collectErrors(
      this._getPrevAndNextEqualityError(item, options),
      this._getNotFoundError(item, options)
    );
  }

  _getEditErrors({ item, newItem }, options = {}) {
    const errors = [];

    errors.push(this._getNothingToUpdateError(item, newItem, options));

    if (this._isDayBetweenSameRangeWithItem(newItem.day, item, options)) {
      errors.push(
        this._getPrevValueNotEqualsError(newItem, {
          ...options,
          excludeItems: [item],
        }),
        this._getNextValueNotEqualsError(newItem, {
          ...options,
          excludeItems: [item],
        })
      );
    }

    errors.push(
      this._getDeleteErrors(item, options),
      this._getAddErrors(newItem, { ...options, excludeItems: [item] })
    );

    return this._collectErrors(errors);
  }

  //    validation errors collector
  _collectErrors(...errors) {
    return errors.filter((error) => error !== null);
  }

  //    validation error generators
  _getInterruptItemError(item, options = {}) {
    if (this._isInterruptItem(item)) {
      return 'Interrupt item not allowed by method';
    }

    return null;
  }

  _getAlreadyExistsError(item, options = {}) {
    if (item === undefined || this._hasItemOn(item.day, options)) {
      const upperFirstItemName = upperFirst(lowerCase(item.constructor.name));

      return `${upperFirstItemName} with value "${item.value.toString()}" at ${item.day.toString()} already exists`;
    }

    return null;
  }

  _getNotFoundError(item, options = {}) {
    if (!this._hasItem(item, (options = {}))) {
      const upperFirstItemName = upperFirst(lowerCase(item.constructor.name));

      return `${upperFirstItemName} with value "${item.value.toString()}" at ${item.day.toString()} not found`;
    }

    return null;
  }

  _getPrevValueNotEqualsError(item, options = {}) {
    const itemName = lowerCase(item.constructor.name);
    const prevItem = this._getPrevItemAt(item.day, options);

    if (prevItem !== undefined && item.value === prevItem.value) {
      return `Previous ${itemName} already have value "${prevItem.value}"`;
    }
    return null;
  }

  _getNextValueNotEqualsError(item, options = {}) {
    const itemName = lowerCase(item.constructor.name);
    const nextItem = this._getNextItemAt(item.day, options);

    if (nextItem !== undefined && item.value === nextItem.value) {
      return `Next ${itemName} already have value "${nextItem.value}"`;
    }

    return null;
  }

  _getPrevAndNextEqualityError(item, options = {}) {
    const prevItem = this._getPrevItem(item, options);
    const nextItem = this._getNextItem(item, options);

    if (
      prevItem !== undefined &&
      nextItem !== undefined &&
      this._compareItemValues(prevItem, nextItem)
    ) {
      const itemName = lowerCase(item.constructor.name);
      return `Previous ${itemName} eqauls next ${itemName}`;
    }

    return null;
  }

  _getBeforeOrEqualPreviousInterruptDayError(item) {
    const itemName = lowerCase(item.constructor.name);

    const prevInerruptDayAt = this._getPrevInterruptDayAt();

    if (prevInerruptDayAt !== undefined && item.day <= prevInerruptDayAt) {
      return `${
        item.constructor.name
      } cannot be before or equals previous end day`;
    }

    return null;
  }

  _getNothingToUpdateError(item, newItem, options = {}) {
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
    const prevItemForDay = this._getPrevItemAt(day);
    const prevItemForItem = this._getPrevItem(item);

    return (
      prevItemForDay !== undefined && prevItemForDay.equals(prevItemForItem)
    );
  }
}
