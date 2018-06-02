import { lowerFirst, lowerCase, upperFirst, upperCase } from 'lodash';

import { applyFSM, getDayComparator } from '../BaseMethods';
import { BaseClass } from '../BaseClass';

import { OperationErrorFactory as ErrorFactory } from 'src/infra/errorFactories/OperationErrorFactory';
import { Day } from '../../commonTypes';

// state-transition functions
function getPostValidationState() {
  if (this.validationErrors.length === 0) {
    return 'result';
  }
  return 'error';
}

export class BaseValueCollection extends BaseClass {
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

  constructor(items = []) {
    super();
    this.items = items;

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

  getItemsAt(day = new Day(), items = [...this._items]) {
    if (items.length === 0) {
      return [];
    }

    return items
      .sort(getDayComparator())
      .filter(({ day: currentDay }) => currentDay <= day);
  }

  getItemValueAt(day = new Day(), items = [...this.items]) {
    const item = this._getItemAt(day, items);

    return item !== undefined ? item.value : undefined;
  }

  setItems(newItems = [], items = [...this.items]) {
    return this._emit('set', { newItems, items });
  }

  addItem(item, items = [...this.items]) {
    return this._emit('add', { item, items });
  }

  deleteItem(item, items = [...this.items]) {
    return this._emit('delete', { item, items });
  }

  editItem(item, newItem, items = [...this.items]) {
    return this._emit('edit', { item, newItem, items });
  }

  hasItemsAt(day = new Day()) {
    return this.getItemsAt(day).length !== 0;
  }

  map(fn, items = this.items) {
    return this.items.map(fn);
  }

  reduce(fn, items = this.items) {
    return this.items.reduce(fn);
  }

  filter(fn, items = this.items) {
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
    this.items = [...this.items, item];
  }

  _delete({ item }) {
    this.items = this.items.filter((currentItem) => !item.equals(currentItem));
  }

  _edit({ item, newItem }) {
    this._delete({ item });
    this._add({ item: newItem });
  }

  // validation error setters
  _validateAddOperation() {
    this.validationErrors = this._getAddError(
      this.operationArgs.item,
      this.operationArgs.items
    );
  }

  _validateDeleteOperation() {
    this.validationErrors = this._getDeleteError(
      this.operationArgs.item,
      this.operationArgs.items
    );
  }

  _validateEditOperation() {
    this.validationErrors = this._getEditError(
      this.operationArgs.item,
      this.operationArgs.newItem,
      this.operationArgs.items
    );
  }

  _validateSetOperation() {
    this.validationErrors = [];
  }

  // operation validation error generators
  _getAddError(item, items = [...this.items]) {
    return [
      ...this._getAlreadyExistsError(item, items),
      ...this._getPrevNotAllowedError(item, items),
      ...this._getNextNotAllowedError(item, items),
    ];
  }

  _getDeleteError(item, items = [...this.items]) {
    return [
      ...this._getPrevAndNextEqualityError(item, items),
      ...this._getNotFoundError(item, items),
    ];
  }

  _getEditError(item, newItem, items = [...this.items]) {
    const nothingToUpdateError = this._getNothingToUpdateError(
      item,
      newItem,
      items
    );

    if (nothingToUpdateError.length !== 0) {
      return nothingToUpdateError;
    }

    const itemsWithoutItem = items.filter(
      (currentItem) => !item.equals(currentItem)
    );

    const itemNotFoundError = this._getNotFoundError(item, items);
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

    const prevOfItem = this._getPrevItemAt(item.day.prev(), items);
    const prevOfNewItem = this._getPrevItemAt(newItem.day, itemsWithoutItem);

    if (prevOfItem !== undefined && prevOfItem.equals(prevOfNewItem)) {
      return [
        ...this._getPrevNotAllowedError(newItem, itemsWithoutItem),
        ...this._getNextNotAllowedError(newItem, itemsWithoutItem),
      ];
    }

    return [
      ...this._getAddError(newItem, itemsWithoutItem),
      ...this._getDeleteError(item, items),
    ];
  }

  // validation error generators
  _getAlreadyExistsError(item, items = [...this.items]) {
    if (item === undefined || this._hasItemOn(item.day, items)) {
      const upperFirstItemName = upperFirst(lowerCase(item.constructor.name));

      return [
        `${upperFirstItemName} with value "${item.value.toString()}" at ${item.day.toString()} already exists`,
      ];
    }

    return [];
  }

  _getNotFoundError(item, items = [...this.items]) {
    if (!this._hasItem(item, items)) {
      const upperFirstItemName = upperFirst(lowerCase(item.constructor.name));

      return [
        `${upperFirstItemName} with value "${item.value.toString()}" at ${item.day.toString()} not found`,
      ];
    }

    return [];
  }

  _getPrevNotAllowedError(item, items = [...this.items]) {
    const itemName = lowerCase(item.constructor.name);
    const prevItem = this._getPrevItemAt(item.day, items);

    if (prevItem !== undefined && item.value === prevItem.value) {
      return [`Previous ${itemName} already have value "${prevItem.value}"`];
    }
    return [];
  }

  _getNextNotAllowedError(item, items = [...this.items]) {
    const itemName = lowerCase(item.constructor.name);
    const nextItem = this._getNextItemAt(item.day, items);

    if (nextItem !== undefined && item.value === nextItem.value) {
      return [`Next ${itemName} already have value "${nextItem.value}"`];
    }

    return [];
  }
  _getPrevAndNextEqualityError(item, items = [...this.items]) {
    const itemName = lowerCase(item.constructor.name);

    const prev = this._getPrevItemAt(item.day.prev(), items);
    const next = this._getNextItemAt(item.day.next(), items);

    if (prev !== undefined && next !== undefined && prev.value === next.value) {
      return [
        `Previous ${itemName} value and next ${itemName} value are equal`,
      ];
    }

    return [];
  }

  _getNothingToUpdateError(item, newItem, items = [...this.items]) {
    if (item !== undefined && item.equals(newItem)) {
      return ['Nothing to update'];
    }

    return [];
  }

  // search items
  _getPrevItemAt(day = new Day(), items = [...this.items]) {
    const itemsBeforeDay = items
      .sort(getDayComparator())
      .filter(({ day: currentDay }) => currentDay < day);

    return itemsBeforeDay[itemsBeforeDay.length - 1];
  }

  _getNextItemAt(day = new Day(), items = [...this.items]) {
    const itemsAfterDay = items
      .sort(getDayComparator())
      .filter(({ day: currentDay }) => currentDay > day);
    return itemsAfterDay[0];
  }
  _hasItemOn(day = new Day(), items = [...this.items]) {
    const persistedItem = this._getItemOn(day, items);
    return !!persistedItem;
  }

  _hasItem(item, items = [...this.items]) {
    const persistedItem = this._getItemOn(item.day, items);
    return persistedItem !== undefined && item.equals(persistedItem);
  }

  _getItemOn(day = new Day(), items = [...this.items]) {
    return this.getItemsAt(day, items).find(({ day: currentDay }) =>
      currentDay.equals(day)
    );
  }

  _getItemAt(day = new Day(), items = [...this.items]) {
    const itemsAt = this.getItemsAt(day);

    return itemsAt[itemsAt.length - 1];
  }
}
