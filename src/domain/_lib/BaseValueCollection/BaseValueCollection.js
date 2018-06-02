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

  constructor(collection = []) {
    super();
    this.collection = collection;

    applyFSM(this.constructor);
    this._fsm();
  }

  get collection() {
    return this.getCollectionAt();
  }

  get itemValue() {
    return this.getPrevItemValueAt();
  }

  get hasCollection() {
    return this.hasItemAt();
  }

  set collection(collection) {
    this._collection = collection;
  }

  setItems(items = [], collection = [...this.collection]) {
    return this._emit('set', { items });
  }

  addItem(item, collection = [...this.collection]) {
    return this._emit('add', { item });
  }

  deleteItem(item, collection = [...this.collection]) {
    return this._emit('delete', { item });
  }

  getPrevItemAt(day = new Day(), collection = [...this.collection]) {
    const collectionBeforeDay = collection
      .sort(getDayComparator())
      .filter(({ day: currentDay }) => currentDay < day);

    return collectionBeforeDay[collectionBeforeDay.length - 1];
  }

  getPrevItemValueAt(day = new Day(), collection = [...this.collection]) {
    const item = this.getPrevItemAt(day);
    return item === undefined ? undefined : item.value;
  }

  getNextItemAt(day = new Day(), collection = [...this.collection]) {
    const collectionAfterDay = collection
      .sort(getDayComparator())
      .filter(({ day: currentDay }) => currentDay > day);
    return collectionAfterDay[0];
  }

  hasItemAt(day, collection = [...this.collection]) {
    const persistedItem = this.getItemAt(day, collection);
    return !!persistedItem;
  }

  hasItem(item, collection = [...this.collection]) {
    const persistedItem = this.getItemAt(item.day, collection);
    return persistedItem !== undefined && item.equals(persistedItem);
  }

  getItemAt(day = new Day(), collection = [...this.collection]) {
    return this.getCollectionAt(day, collection).find(({ day: currentDay }) =>
      currentDay.equals(day)
    );
  }

  getCollectionAt(day = new Day(), collection = [...this._collection]) {
    if (collection.length === 0) {
      return [];
    }

    return collection
      .sort(getDayComparator())
      .filter(({ day: currentDay }) => currentDay <= day);
  }

  map(fn, collection = this.collection) {
    return this.collection.map(fn);
  }

  reduce(fn, collection = this.collection) {
    return this.collection.reduce(fn);
  }

  filter(fn, collection = this.collection) {
    return this.collection.filter(fn);
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
  _set({ items }) {
    this.collection = items;
  }

  _add({ item }) {
    this.collection = [...this.collection, item];
  }

  _delete({ item }) {
    this.collection = this.collection.filter(
      (currentItem) => !item.equals(currentItem)
    );
  }

  // validation error setters
  _validateAddOperation() {
    const { item } = this.operationArgs;

    this.validationErrors = [
      ...this._getAlreadyExistsError(item),
      ...this._getPrevNotAllowedError(item),
      ...this._getNextNotAllowedError(item),
    ];
  }

  _validateDeleteOperation() {
    const { item } = this.operationArgs;

    this.validationErrors = [
      ...this._getPrevAndNextEqualityError(item),
      ...this._getNotFoundError(item),
    ];
  }

  _validateEditOperation() {
    const { item, newItem } = this.operationArgs;

    this.validationErrors = [
      ...this._getPrevAndNextEqualityError(item),
      ...this._getNotFoundError(item),
    ];
  }

  _validateSetOperation() {
    this.validationErrors = [];
  }

  // validation error generators
  _getAlreadyExistsError(item, collection = [...this.collection]) {
    const upperFirstItemName = upperFirst(lowerCase(item.constructor.name));

    if (this.hasItemAt(item.day, collection)) {
      return [
        `${upperFirstItemName} with value "${item.value.toString()}" at ${item.day.toString()} already exists`,
      ];
    }

    return [];
  }

  _getNotFoundError(item, collection = [...this.collection]) {
    const upperFirstItemName = upperFirst(lowerCase(item.constructor.name));

    if (!this.hasItem(item)) {
      return [
        `${upperFirstItemName} with value "${item.value.toString()}" at ${item.day.toString()} not found`,
      ];
    }

    return [];
  }

  _getPrevNotAllowedError(item, collection = [...this.collection]) {
    const itemName = lowerCase(item.constructor.name);
    const prevItem = this.getPrevItemAt(item.day);

    if (prevItem !== undefined && item.value === prevItem.value) {
      return [`Previous ${itemName} already have value "${prevItem.value}"`];
    }
    return [];
  }

  _getNextNotAllowedError(item, collection = [...this.collection]) {
    const itemName = lowerCase(item.constructor.name);
    const nextItem = this.getNextItemAt(item.day);

    if (nextItem !== undefined && item.value === nextItem.value) {
      return [`Next ${itemName} already have value "${nextItem.value}"`];
    }

    return [];
  }
  _getPrevAndNextEqualityError(item, collection = [...this.collection]) {
    const itemName = lowerCase(item.constructor.name);

    const prev = this.getPrevItemAt(item.day.prev());
    const next = this.getNextItemAt(item.day.next());

    if (prev !== undefined && next !== undefined && prev.value === next.value) {
      return [
        `Previous ${itemName} value and next ${itemName} value are equal`,
      ];
    }

    return [];
  }
}
