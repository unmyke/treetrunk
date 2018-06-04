import { lowerFirst, lowerCase, upperFirst, upperCase } from 'lodash';

import { applyFSM, getDayComparator } from '../../_lib/BaseMethods';
import { BaseClass } from '../../_lib';

import { Day } from '../Day';

import { Operation as ErrorFactory } from 'src/infra/errorFactories';

export class ValueDayProgress extends BaseClass {
  static errorFactory = new ErrorFactory();

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

        this._validation();
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

  static create(items = []) {
    return new ValueDayProgress(items);
  }

  static createInterruptible(items = [], interruptValue) {
    return new ValueDayProgress(items, interruptValue);
  }

  // state-transition functions
  static getPostValidationState() {
    if (this.operation.errors.length === 0) {
      return 'result';
    }
    return 'error';
  }

  static constraints = {
    add: {
      item: {
        operationArgument: {
          isExist: true,
          notEqualPrev: true,
          notEqualNext: true,
        },
      },
      item: {
        operationArgument: {
          isExist: true,
          notEqualPrev: true,
          notEqualNext: true,
        },
      },
    },
    delete: {},
    edit: {},
    set: {},
  };

  constructor(items = [], interruptValue) {
    super();
    this._items = [...items];
    this.interruptValue = interruptValue;

    applyFSM(this.constructor);
    this._fsm();
  }

  // getters
  get items() {
    return this.getItemsAt();
  }

  get itemValue() {
    return this.getItemValueAt();
  }

  get hasItems() {
    return this.getItemsAt().length !== 0;
  }

  getItemsAt(day = new Day()) {
    const items = this._getItemsContainsDay(day);

    return items.filter(({ day: currentDay }) => currentDay <= day);
  }

  getItemValueAt(day = new Day()) {
    const item = this._getItemAt(day);

    return item !== undefined ? item.value : undefined;
  }

  hasItemsAt(day = new Day()) {
    return items.length !== 0;
  }

  // operations
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

  map(fn) {
    return this.items.map(fn);
  }

  reduce(fn) {
    return this.items.reduce(fn);
  }

  filter(fn) {
    return this.items.filter(fn);
  }

  // private

  // operation runner
  _emit(operation) {
    this.operate(operation);
    const result = this.process();
    this.reset();
    return result;
  }

  // primitive oparations
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

  // validation runner
  _validation() {
    const validationMethod = `_validate${upperFirst(
      this.operation.name
    )}Operation`;

    this[validationMethod]();
  }

  // operation validation error generators
  _validateAddOperation() {
    const { item } = this.operation.args;

    this.operation.errors = this._collectErrors(
      this._getAlreadyExistsError(item),
      this._getPrevNotAllowedError(item),
      this._getNextNotAllowedError(item)
    );
  }

  _validateDeleteOperation() {
    const { item } = this.operation.args;

    this.operation.errors = this._collectErrors(
      this._getPrevAndNextEqualityError(item),
      this._getNotFoundError(item)
    );
  }

  _validateEditOperation() {
    const { item, newItem } = this.operation.args;

    const nothingToUpdateError = this._getNothingToUpdateError(item, newItem);

    if (nothingToUpdateError.length !== 0) {
      this.operation.errors = this._collectErrors(nothingToUpdateError);
    }

    const itemsWithoutItem = this.items.filter(
      (currentItem) => !item.equals(currentItem)
    );

    const itemNotFoundError = this._getNotFoundError(item, this.items);
    const newAlreadyItemExistsError = this._getAlreadyExistsError(
      newItem,
      itemsWithoutItem
    );

    if (
      itemNotFoundError.length !== 0 ||
      newAlreadyItemExistsError.length !== 0
    ) {
      this.operation.errors = this._collectErrors(
        itemNotFoundError,
        newAlreadyItemExistsError
      );
    }

    const prevOfItem = this._getPrevItemAt(item.day.prev());
    const prevOfNewItem = this._getPrevItemAt(newItem.dayWithoutItem);

    if (prevOfItem !== undefined && prevOfItem.equals(prevOfNewItem)) {
      this.operation.errors = this._collectErrors(
        this._getPrevNotAllowedError(newItem),
        this._getNextNotAllowedError(newItem)
      );
    }

    this.operation.errors = this._collectErrors(
      this._getAddError(newItem),
      this._getDeleteError(item)
    );
  }

  _validateSetOperation() {
    this.operation.errors = [];
  }

  // validation errors collector
  _collectErrors(...errors) {
    return errors.filter((error) => error !== null);
  }

  // validation error generators
  _getAlreadyExistsError(item) {
    if (item === undefined || this._hasItemOn(item.day)) {
      const upperFirstItemName = upperFirst(lowerCase(item.constructor.name));

      return `${upperFirstItemName} with value "${item.value.toString()}" at ${item.day.toString()} already exists`;
    }

    return null;
  }

  _getNotFoundError(item) {
    if (!this._hasItem(item)) {
      const upperFirstItemName = upperFirst(lowerCase(item.constructor.name));

      return `${upperFirstItemName} with value "${item.value.toString()}" at ${item.day.toString()} not found`;
    }

    return null;
  }

  _getPrevNotAllowedError(item) {
    const itemName = lowerCase(item.constructor.name);
    const prevItem = this._getPrevItemAt(item.day);

    if (prevItem !== undefined && item.value === prevItem.value) {
      return `Previous ${itemName} already have value "${prevItem.value}"`;
    }
    return null;
  }

  _getNextNotAllowedError(item) {
    const itemName = lowerCase(item.constructor.name);
    const nextItem = this._getNextItemAt(item.day);

    if (nextItem !== undefined && item.value === nextItem.value) {
      return `Next ${itemName} already have value "${nextItem.value}"`;
    }

    return null;
  }

  _getPrevAndNextEqualityError(item) {
    const itemName = lowerCase(item.constructor.name);

    const prev = this._getPrevItemAt(item.day);
    const next = this._getNextItemAt(item.day);

    if (prev !== undefined && next !== undefined && prev.value === next.value) {
      return `Previous ${itemName} value and next ${itemName} value are equal`;
    }

    return null;
  }

  _getNothingToUpdateError(item, newItem) {
    if (item !== undefined && item.equals(newItem)) {
      return 'Nothing to update';
    }

    return null;
  }

  // search items
  _getPrevItemAt(day = new Day()) {
    const itemsBeforeDay = this._getItemsBeforeDay(day);

    return itemsBeforeDay[itemsBeforeDay.length - 1];
  }

  _getNextItemAt(day = new Day()) {
    const itemsAfterDay = this._getItemsAfterDay(day);

    return itemsAfterDay[0];
  }

  _hasItemOn(day = new Day()) {
    const persistedItem = this._getItemOn(day);
    return !!persistedItem;
  }

  _hasItem(item) {
    const persistedItem = this._getItemOn(item.day);
    return persistedItem !== undefined && item.equals(persistedItem);
  }

  _getItemOn(day = new Day()) {
    const itemAtDay = this._getItemAt(day);

    if (itemAtDay === undefined || !day.equals(itemAtDay.day)) {
      return;
    }

    return itemAtDay;
  }

  _getItemAt(day = new Day()) {
    const itemsAt = this.getItemsAt(day);

    return itemsAt[itemsAt.length - 1];
  }

  _getItemsBeforeDay(day = new Day(), items = this._getItemsContainsDay(day)) {
    return items.filter(({ day: currentDay }) => currentDay < day);
  }

  _getItemsAfterDay(day = new Day(), items = this._getItemsContainsDay(day)) {
    return items.filter(({ day: currentDay }) => currentDay > day);
  }

  _getItemsContainsDay(day = new Day()) {
    if (this._items.length === 0) {
      return [];
    }

    const prevInerruptDay = this._getPrevInerruptDayAt(day);
    const nextInerruptDay = this._getNextInerruptDayAt(day);

    return this._items
      .sort(getDayComparator('asc'))
      .filter(
        ({ day: currentDay }) =>
          (!prevInerruptDay || currentDay > prevInerruptDay) &&
          (!nextInerruptDay || currentDay < nextInerruptDay)
      );
  }

  _getPrevInerruptDayAt(day = new Day()) {
    const inerruptItems = this._getInerruptDays();

    return inerruptItems
      .sort(getDayComparator('asc'))
      .reduce(
        (interruptDay, { day: currentInterruptDay }) =>
          currentInterruptDay <= day ? currentInterruptDay : interruptDay,
        undefined
      );
  }

  _getNextInerruptDayAt(day = new Day()) {
    const inerruptItems = this._getInerruptDays();

    return inerruptItems
      .sort(getDayComparator('desc'))
      .reduce(
        (interruptDay, { day: currentInterruptDay }) =>
          currentInterruptDay > day ? currentInterruptDay : interruptDay,
        undefined
      );
  }

  _getInerruptDays() {
    if (this.interruptValue === undefined) {
      return [];
    }

    return this._items
      .filter(({ value }) => _compareValues(value, this.interruptValue))
      .map(({ day }) => day);
  }

  // utils
  _compareValues(value1, value2) {
    if (value1 instanceof BaseValue) {
      return value1.equals(value2);
    }

    return value1 === value2;
  }
}
