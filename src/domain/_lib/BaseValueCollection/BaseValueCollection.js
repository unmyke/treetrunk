import { lowerFirst, lowerCase } from 'lodash';

import { applyFSM, getDayComparator } from '../BaseMethods';
import { BaseClass } from '../BaseClass';

import { OperationErrorFactory as ErrorFactory } from 'src/infra/errorFactories/OperationErrorFactory';
import { Day } from '../../commonTypes';

function getOperation(operation) {
  switch (operation) {
    case 'set':
      return 'setCollection';
    case 'add':
      return 'validateAddition';
    case 'delete':
      return 'validateDeletion';
    default:
      return 'iddle';
  }
}

function getPostValidationState() {
  if (Object.keys(this.validationErrors).length === 0) {
    return 'result';
  }
  return 'error';
}

export class BaseValueCollection extends BaseClass {
  static errorFactory = new ErrorFactory();
  static fsm = {
    init: 'idle',
    transitions: [
      { name: 'operate', from: 'idle', to: getOperation },
      {
        name: 'process',
        from: ['validateAddition', 'validateDeletion', 'setCollection'],
        to: getPostValidationState,
      },
      { name: 'reset', from: ['result', 'error'], to: 'idle' },
    ],

    // data: function(collection) {
    //   return {
    //     collection: collection,
    //   };
    // },

    methods: {
      onIdle() {
        this.validationErrors = {};
        this.operationArgs = {};
      },

      onBeforeOperate(lifecycle, operation, operationArgs) {
        this.operation = operation;
        this.operationArgs = operationArgs;
      },

      onValidateAddition() {
        const { item } = this.operationArgs;

        const validationErrors = this.getAdditionErrors(item);
        if (validationErrors.length !== 0) {
          this.validationErrors = {
            [lowerFirst(item.constructor.name)]: validationErrors,
          };
        }
      },
      onResult() {
        console.log(this.operationArgs.item.value);
        this[this.operation](this.operationArgs);
      },

      onError() {
        return this.validationErrors;
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

  set collection(collection) {
    this._collection = collection;
  }

  add({ item }) {
    this.collection = [...this.collection, item];
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

  isItemExists(item, collection = [...this.collection]) {
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

  getAdditionErrors(item) {
    return [
      ...this.getAlreadyExistsError(item),
      ...this.getPrevNotAllowedError(item),
      ...this.getNextNotAllowedError(item),
    ];
  }

  getAlreadyExistsError(item, collection = [...this.collection]) {
    if (this.isItemExists(item, collection)) {
      return [`${item.constructor.name} ${item.toString()} already exists`];
    }

    return [];
  }

  getPrevNotAllowedError(item, collection = [...this.collection]) {
    const itemName = lowerCase(item.constructor.name);
    const prevItem = this.getPrevItemAt(item.day);

    if (prevItem !== undefined && item.value === prevItem.value) {
      return [`Previous ${itemName} already have value ${prevItem.value}`];
    }
    return [];
  }

  getNextNotAllowedError(item, collection = [...this.collection]) {
    const itemName = lowerCase(item.constructor.name);
    const nextItem = this.getNextItemAt(item.day);

    if (nextItem !== undefined && item.value === nextItem.value) {
      return [`Next ${itemName} already have value ${prevItem.value}`];
    }

    return [];
  }
}
