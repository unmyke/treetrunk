import { lowerFirst, lowerCase, upperFirst, upperCase } from 'lodash';

import { applyFSM, getDayComparator } from '../../_lib/BaseMethods';
import { BaseClass } from '../../_lib';

import { Day } from '../Day';
import { Operation as ErrorFactory } from 'src/infra/errorFactories';

// state-transition functions
function getPostValidationState() {
  if (this.validationErrors.length === 0) {
    return 'result';
  }
  return 'error';
}

export class ValueDayProgress extends BaseClass {
  static errorFactory = new ErrorFactory();
  static fsm = {
    init: 'idle',

    transitions: [
      { name: 'operate', from: 'idle', to: 'validation' },
      { name: 'process', from: 'validation', to: getPostValidationState },
      { name: 'reset', from: ['result', 'error'], to: 'idle' },
    ],

    methods: {
      onIdle() {
        this.operation = '';
        this.validationErrors = [];
        this.operationArgs = {};
      },

      onValidation(lifecycle, operation, operationArgs) {
        this.operation = operation;
        this.operationArgs = operationArgs;

        this[`_validate${upperFirst(this.operation)}Operation`]();
      },

      onResult() {
        const primitiveOperationName = `_${this.operation}`;

        this[primitiveOperationName](this.operationArgs);
        return {
          done: true,
          error: null,
        };
      },

      onError() {
        return {
          done: false,
          error: this.validationErrors,
        };
      },
    },
  };

  constructor(items = [], interruptValue) {
    super();
    this.items = items;
    this.interruptValue = interruptValue;

    applyFSM(this.constructor);
    this._fsm();
  }

  get items() {
    return this.getItemsAt();
  }

  get itemValue() {
    return this.getItemValueAt();
  }

  get hasItems() {
    return this.getItemsAt().length !== 0;
  }

  set items(items) {
    this._items = items;
  }

  getItemsAt(day = new Day()) {
    const items = this._getItemsContainsDay(day);

    return items.filter(({ day: currentDay }) => currentDay <= day);
  }

  getItemValueAt(day = new Day()) {
    const item = this._getItemAt(day);

    return item !== undefined ? item.value : undefined;
  }

  setItems(newItems = []) {
    return this._emit('set', { newItems });
  }

  addItem(item) {
    return this._emit('add', { item });
  }

  deleteItem(item) {
    return this._emit('delete', { item });
  }

  editItem(item, newItem) {
    return this._emit('edit', { item, newItem });
  }

  hasItemsAt(day = new Day()) {
    return items.length !== 0;
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
  _emit(operation, operationArgs) {
    this.operate(operation, operationArgs);
    const result = this.process();
    this.reset();
    return result;
  }

  // primitive oparations
  _set({ newItems }) {
    this.items = newItems;
  }

  _add({ item }) {
    this.items = [...this._items, item];
  }

  _delete({ item }) {
    this.items = this._items.filter((currentItem) => !item.equals(currentItem));
  }

  _edit({ item, newItem }) {
    this._delete({ item });
    this._add({ item: newItem });
  }

  // validation error setters
  _validateAddOperation() {
    this.validationErrors = this._getAddError(this.operationArgs.item);
  }

  _validateDeleteOperation() {
    this.validationErrors = this._getDeleteError(this.operationArgs.item);
  }

  _validateEditOperation() {
    this.validationErrors = this._getEditError(
      this.operationArgs.item,
      this.operationArgs.newItem
    );
  }

  _validateSetOperation() {
    this.validationErrors = [];
  }

  // operation validation error generators
  _getAddError(item) {
    return [
      ...this._getAlreadyExistsError(item),
      ...this._getPrevNotAllowedError(item),
      ...this._getNextNotAllowedError(item),
    ];
  }

  _getDeleteError(item) {
    return [
      ...this._getPrevAndNextEqualityError(item),
      ...this._getNotFoundError(item),
    ];
  }

  _getEditError(item, newItem) {
    const nothingToUpdateError = this._getNothingToUpdateError(item, newItem);

    if (nothingToUpdateError.length !== 0) {
      return nothingToUpdateError;
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
      return [...itemNotFoundError, ...newAlreadyItemExistsError];
    }

    const prevOfItem = this._getPrevItemAt(item.day.prev());
    const prevOfNewItem = this._getPrevItemAt(newItem.dayWithoutItem);

    if (prevOfItem !== undefined && prevOfItem.equals(prevOfNewItem)) {
      return [
        ...this._getPrevNotAllowedError(newItem),
        ...this._getNextNotAllowedError(newItem),
      ];
    }

    return [...this._getAddError(newItem), ...this._getDeleteError(item)];
  }

  // validation error generators
  _getAlreadyExistsError(item) {
    if (item === undefined || this._hasItemOn(item.day)) {
      const upperFirstItemName = upperFirst(lowerCase(item.constructor.name));

      return [
        `${upperFirstItemName} with value "${item.value.toString()}" at ${item.day.toString()} already exists`,
      ];
    }

    return [];
  }

  _getNotFoundError(item) {
    if (!this._hasItem(item)) {
      const upperFirstItemName = upperFirst(lowerCase(item.constructor.name));

      return [
        `${upperFirstItemName} with value "${item.value.toString()}" at ${item.day.toString()} not found`,
      ];
    }

    return [];
  }

  _getPrevNotAllowedError(item) {
    const itemName = lowerCase(item.constructor.name);
    const prevItem = this._getPrevItemAt(item.day);

    if (prevItem !== undefined && item.value === prevItem.value) {
      return [`Previous ${itemName} already have value "${prevItem.value}"`];
    }
    return [];
  }

  _getNextNotAllowedError(item) {
    const itemName = lowerCase(item.constructor.name);
    const nextItem = this._getNextItemAt(item.day);

    if (nextItem !== undefined && item.value === nextItem.value) {
      return [`Next ${itemName} already have value "${nextItem.value}"`];
    }

    return [];
  }

  _getPrevAndNextEqualityError(item) {
    const itemName = lowerCase(item.constructor.name);

    const prev = this._getPrevItemAt(item.day);
    const next = this._getNextItemAt(item.day);

    if (prev !== undefined && next !== undefined && prev.value === next.value) {
      return [
        `Previous ${itemName} value and next ${itemName} value are equal`,
      ];
    }

    return [];
  }

  _getNothingToUpdateError(item, newItem) {
    if (item !== undefined && item.equals(newItem)) {
      return ['Nothing to update'];
    }

    return [];
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
      .filter(({ value }) => _copareValues(value, this.interruptValue))
      .map(({ day }) => day);
  }

  // utils
  _copareValues(value1, value2) {
    if (value1 instanceof BaseValue) {
      return value1.equals(value2);
    }

    return value1 === value2;
  }
}
