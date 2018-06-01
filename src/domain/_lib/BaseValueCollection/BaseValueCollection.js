import { lowerFirst, lowerCase, upperFirst } from 'lodash';

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
      { name: 'operate', from: 'idle', to: 'validate' },
      {
        name: 'process',
        from: 'validate',
        to: getPostValidationState,
      },
      { name: 'reset', from: ['result', 'error'], to: 'idle' },
    ],

    methods: {
      onIdle() {
        this.operation = '';
        this.validationErrors = [];
        this.operationArgs = {};
      },

      onBeforeOperate(lifecycle, operation, operationArgs) {
        this.operation = operation;
        this.operationArgs = operationArgs;
      },

      onValidate() {
        const methodName = `_validate${upperFirst(this.operation)}Operation`;

        this[methodName]();
      },

      onResult() {
        const primitiveOperationName = `_${this.operation}`;

        this[primitiveOperationName](this.operationArgs);
      },

      onError() {
        throw this.constructor.errorFactory.createNotAllowed(
          this,
          ...this.validationErrors
        );
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

  set collection(collection = []) {
    this._collection = collection;
  }

  setItems(items = [], collection = [...this.collection]) {
    this._emit('set', { items });
  }

  addItem(item, collection = [...this.collection]) {
    this._emit('add', { item });
  }

  deleteItem(item, collection = [...this.collection]) {
    this._emit('delete', { item });
  }

  getPrevItemAt(day = new Day(), collection = [...this.collection]) {
    const collectionBeforeDay = collection
      .sort(getDayComparator())
      .filter(({ day: currentDay }) => currentDay < day);

    return collectionBeforeDay[collectionBeforeDay.length - 1];
  }

  getNextItemAt(day = new Day(), collection = [...this.collection]) {
    const collectionAfterDay = collection
      .sort(getDayComparator())
      .filter(({ day: currentDay }) => currentDay > day);
    return collectionAfterDay[0];
  }

  isItemExistsAt(day, collection = [...this.collection]) {
    const persistedItem = this.getItemAt(day, collection);
    return !!persistedItem;
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

  // private

  // operation runner
  _emit(operation, operationArgs) {
    // console.log(operation);
    // console.log(operationArgs);
    this.operate(operation, operationArgs);
    this.process();
    this.reset();
  }

  // primitive oparations
  _set({ collection }) {
    this.collection = collection;
  }

  _add({ item }) {
    this.collection = [...this.collection, item];
  }

  _delete({ item }) {
    this.collection = this.collection.filter(
      (currentItem) => !item.equals(currentItem)
    );
  }

  // operation validators
  _validateAddOperation() {
    this._setAdditionErrors(this.operationArgs.item);
  }

  _validateDeleteOperation() {
    this._setDeletionErrors(this.operationArgs.item);
  }

  _validateSetOperation() {
    this._setSetterErrors();
  }

  // validation error setters
  _setAdditionErrors(item) {
    this.validationErrors = [
      ...this._getAlreadyExistsError(item),
      ...this._getPrevNotAllowedError(item),
      ...this._getNextNotAllowedError(item),
    ];
  }

  _setDeletionErrors(item) {
    this.validationErrors = [
      ...this._getPrevAndNextEqualityError(item),
      ...this._getNotFoundError(item),
    ];
  }

  _setSetterErrors(item) {
    this.validationErrors = [];
  }

  // validation error generators
  _getAlreadyExistsError(item, collection = [...this.collection]) {
    if (this.isItemExistsAt(item, collection)) {
      return [`${item.constructor.name} ${item.toString()} already exists`];
    }

    return [];
  }

  _getNotFoundError(item, collection = [...this.collection]) {
    if (!this.isItemExistsAt(item, collection)) {
      return [
        `${
          item.constructor.name
        } with value "${item.value.toString()}" at ${item.day.toString()} not found`,
      ];
    }

    return [];
  }

  _getPrevNotAllowedError(item, collection = [...this.collection]) {
    const itemName = lowerCase(item.constructor.name);
    const prevItem = this.getPrevItemAt(item.day);

    if (prevItem !== undefined && item.value === prevItem.value) {
      return [`Previous ${itemName} already have value ${prevItem.value}`];
    }
    return [];
  }

  _getNextNotAllowedError(item, collection = [...this.collection]) {
    const itemName = lowerCase(item.constructor.name);
    const nextItem = this.getNextItemAt(item.day);

    if (nextItem !== undefined && item.value === nextItem.value) {
      return [`Next ${itemName} already have value ${prevItem.value}`];
    }

    return [];
  }
  _getPrevAndNextEqualityError(item, collection = [...this.collection]) {
    const itemName = lowerCase(item.constructor.name);

    const prev = this.getPrevItemAt(item.day.prev());
    const next = this.getNextItemAt(item.day.next());

    if (prev !== undefined && next !== undefined && prev.equals(next)) {
      return [`Previous and next ${itemName} are equal`];
    }

    return [];
  }
}
