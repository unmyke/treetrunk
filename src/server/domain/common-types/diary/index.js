/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
import {
  applyFSM,
  getDayComparator,
  isEqualValues,
} from '../../_lib/base-methods';
import { errors } from '../../errors';
import { BaseClass } from '../../_lib';
import Day from '../day';
import Store from './store';

const states = {
  NEW: 'new',
  STARTED: 'started',
  CLOSED: 'closed',
};

const transitions = {
  ADD_ON_RESTORE: 'addOnRestore',
  ADD_CLOSE_AT_ON_RESTORE: 'addCloseAtOnRestore',
  ADD: 'add',
  DELETE_AT: 'deleteAt',
  UPDATE_TO: 'updateTo',
  ADD_CLOSE_AT: 'addCloseAt',
  DELETE_CLOSE: 'deleteClose',
  UPDATE_CLOSE_TO: 'updateCloseTo',
};

const stateTransitionFunctions = {
  [transitions.DELETE_AT]() {
    if (this._store.size === 1) {
      if (this._archive.size === 0) {
        return states.NEW;
      }

      return states.CLOSED;
    }

    return states.STARTED;
  },
};

const calculateState = ({ _store, _archive }) => {
  if (_store.size === 0) {
    if (_archive.size === 0) {
      return states.NEW;
    }

    return states.CLOSED;
  }

  return states.STARTED;
};

export default class Diary extends BaseClass {
  // factory
  static restore(records = [], closeValue) {
    const diary = new Diary();

    try {
      records
        .sort(getDayComparator('asc', ({ day }) => day))
        .forEach(({ value, day: dayValue }) => {
          const day = new Day({ value: dayValue });
          if (isEqualValues(value, closeValue)) {
            diary.addCloseAtOnRestore(day);
          } else {
            diary.addOnRestore(value, day);
          }
        });

      return diary;
    } catch (originalError) {
      const error = errors.inconsistentState();
      error.originalError = originalError;

      throw error;
    }
  }

  static instanceAt({ _store, _archive }, day = new Day()) {
    const diary = new Diary();

    const archiveLastDay = _archive.lastDay;
    const instanceState = {};

    if (archiveLastDay === undefined || archiveLastDay < day) {
      instanceState.store = _store.filter(
        ({ day: currnetDay }) => currnetDay <= day
      );

      instanceState.archive = Store.clone(_archive);
    } else {
      const newStoreRecord = _archive.getNeighbours(day).next;

      instanceState.store =
        newStoreRecord !== undefined
          ? newStoreRecord.value.filter(
              ({ day: currnetDay }) => currnetDay <= day
            )
          : new Store();

      instanceState.archive = _archive.filter(
        ({ day: currnetDay }) => currnetDay <= day
      );

      const { next: lastStoreRecord } = _archive.getNeighbours(day);

      if (lastStoreRecord !== undefined) {
        const store = lastStoreRecord.value;
        instanceState.store = store.filter(
          ({ day: currnetDay }) => currnetDay <= day
        );
      }
    }

    diary._store = instanceState.store;
    diary._archive = instanceState.archive;
    diary.setState(calculateState(diary));

    return diary;
  }

  // FSM

  static fsm = {
    init: states.NEW,

    ignoreUpdateTrasitions: [
      transitions.ADD_ON_RESTORE,
      transitions.ADD_CLOSE_AT_ON_RESTORE,
    ],

    transitions: [
      {
        name: transitions.ADD,
        from: [states.NEW, states.STARTED, states.CLOSED],
        to: states.STARTED,
      },
      {
        name: transitions.ADD_ON_RESTORE,
        from: [states.NEW, states.STARTED, states.CLOSED],
        to: states.STARTED,
      },
      {
        name: transitions.DELETE_AT,
        from: states.STARTED,
        to: stateTransitionFunctions.deleteAt,
      },
      {
        name: transitions.UPDATE_TO,
        from: states.STARTED,
        to: states.STARTED,
      },
      {
        name: transitions.ADD_CLOSE_AT,
        from: states.STARTED,
        to: states.CLOSED,
      },
      {
        name: transitions.ADD_CLOSE_AT_ON_RESTORE,
        from: states.STARTED,
        to: states.CLOSED,
      },
      {
        name: transitions.DELETE_CLOSE,
        from: states.CLOSED,
        to: states.STARTED,
      },
      {
        name: transitions.UPDATE_CLOSE_TO,
        from: states.CLOSED,
        to: states.CLOSED,
      },
    ],

    methods: {
      onInvalidTransition(transition) {
        switch (transition) {
          case transitions.DELETE_AT:
            throw errors.diaryIsNotStarted();

          case transitions.UPDATE_TO:
            throw errors.diaryIsNotStarted();

          case transitions.ADD_CLOSE_AT:
            throw errors.diaryIsNotStarted();

          case transitions.DELETE_CLOSE:
            throw errors.diaryIsNotClosed();

          case transitions.UPDATE_CLOSE_TO:
            throw errors.diaryIsNotClosed();

          default:
            throw errors.transitionNotAllowed();
        }
      },

      // operaton validations
      onBeforeAdd(_, value, day) {
        this._checkAdd(value, day);
      },

      onBeforeAddOnRestore(_, value, day) {
        this._checkAdd(value, day);
      },

      onBeforeDeleteAt(_, day) {
        this._checkDeleteAt(day);
      },

      onBeforeUpdateTo(_, day, newValue, newDay) {
        this._checkUpdateTo(day, newValue, newDay);
      },

      onBeforeAddCloseAt(_, day) {
        this._checkAddCloseAt(day);
      },

      onBeforeAddCloseAtOnRestore(_, day) {
        this._checkAddCloseAt(day);
      },

      onBeforeUpdateCloseTo(_, day) {
        this._checkUpdateCloseTo(day);
      },

      // operatons
      onAdd(_, value, day) {
        return this._store.add(value, day);
      },

      onAddOnRestore(_, value, day) {
        return this._store.add(value, day);
      },

      onDeleteAt(_, day) {
        return this._store.delete(day);
      },

      onUpdateTo(_, day, newValue, newDay) {
        return this._store.update(day, newValue, newDay);
      },

      onAddCloseAt(_, day) {
        this._archive.add(this._store, day);

        this._store = new Store();
      },

      onAddCloseAtOnRestore(_, day) {
        this._archive.add(this._store, day);

        this._store = new Store();
      },

      onDeleteClose(_) {
        const { value, day } = this._archive.last;

        this._store = value;
        this._archive.delete(day);
      },

      onUpdateCloseTo(_, newDay) {
        const { value, day } = this._archive.last;

        this._archive.delete(day);
        this._archive.add(value, newDay);
      },
    },
  };

  constructor() {
    super();

    this._store = new Store();
    this._archive = new Store();

    this._fsm();
  }

  //  public metods
  //    getters
  get records() {
    return this._store.records;
  }

  get startDay() {
    const firstRecord = this._store.first;

    return firstRecord !== undefined ? firstRecord.day : undefined;
  }

  get closeDay() {
    return this.startDay === undefined ? this._getLastCloseDay() : undefined;
  }

  get recordValue() {
    const lastRecord = this._store.last;

    return lastRecord !== undefined ? lastRecord.value : undefined;
  }

  get recordValues() {
    return this._store.records.map(({ value }) => value);
  }

  get length() {
    return this._store.size;
  }

  get archiveLength() {
    return this._archive.size;
  }

  getFlatRecords(closeValue) {
    const archives = this._archive.records.reduce(
      (archives, { value: store, day: closeDay }) => [
        ...archives,
        ...store.records,
        { value: closeValue, day: closeDay },
      ],
      []
    );

    return [...archives, ...this._store.records];
  }

  //    operations
  map(fn) {
    return this._store.map(fn);
  }

  reduce(fn, initValue) {
    return this._store.reduce(fn, initValue);
  }

  filter(fn) {
    return this._store.filter(fn);
  }

  //  private methods
  //    getters
  _getLastCloseDay() {
    const lastRecord = this._archive.last;

    return lastRecord !== undefined ? lastRecord.day : undefined;
  }

  //    operations
  //      ruleset
  _checkAdd(value, day) {
    this._diaryNotClosed(day);
    this._recordNotExists(day);
    this._recordHasNotDublicate(value, day);
  }

  _checkDeleteAt(day) {
    this._diaryNotClosed(day);
    this._recordExists(day);
    this._recordHasNotEqualNeighbours(day);
  }

  _checkUpdateTo(day, newValue, newDay) {
    this._diaryNotClosed(day);
    this._recordExists(day);

    if (!this._isInLimitedScope(day, newDay)) {
      this._recordHasLimitedScope(day);
      this._recordNotExists(newDay);
    }

    this._diaryNotClosed(newDay);
    this._recordHasNotDublicate(newValue, newDay, day);
  }

  _checkAddCloseAt(day) {
    this._diaryNotClosed(day);
    this._diaryHasNotRecordsLater(day);
  }

  _checkUpdateCloseTo(day) {
    this._lastArchiveHasRecordsLater(day);
  }

  //      ruleset predicate
  _isInLimitedScope(srcDay, dstDay) {
    const srcRecord = this._store.get(srcDay);
    const dstNeighbours = this._store.getNeighbours(dstDay, {
      excludeDay: srcDay,
    });

    return (
      isEqualValues(srcDay, dstDay) ||
      (dstNeighbours.isExists() && srcRecord.prev.equals(dstNeighbours.prev))
    );
  }

  //      ruleset rules
  _diaryNotClosed(day) {
    if (this._getLastCloseDay() > day) {
      throw errors.diaryIsClosed();
    }
  }

  _recordNotExists(day) {
    if (this._store.get(day) !== undefined) {
      throw errors.recordAlreadyExists();
    }
  }

  _recordExists(day) {
    if (this._store.get(day) === undefined) {
      throw errors.recordNotFound();
    }
  }

  _recordHasNotDublicate(value, day, excludeDay) {
    const neighbours = this._store.getNeighbours(day, { excludeDay });

    if (neighbours !== undefined && neighbours.equal(value)) {
      throw errors.recordDuplicate();
    }
  }

  _recordHasNotEqualNeighbours(day) {
    const record = this._store.get(day);

    if (record.hasEqualNieghbours()) {
      throw errors.recordHasEqualNeighbours();
    }
  }

  _recordHasLimitedScope(day) {
    try {
      this._recordHasNotEqualNeighbours(day);
    } catch (originalError) {
      const error = errors.recordHasLimitedScope();
      error.originalError = originalError;

      throw error;
    }
  }

  _diaryHasNotRecordsLater(day) {
    this._hasRecordsLater(this._store, day);
  }

  _lastArchiveHasRecordsLater(day) {
    const { value: lastArchive } = this._archive.last;

    this._hasRecordsLater(lastArchive, day);
  }

  _hasRecordsLater(store, day) {
    if (
      store !== undefined &&
      (store.get(day) !== undefined ||
        store.getNeighbours(day).next !== undefined)
    ) {
      throw errors.diaryHasRecordsLater();
    }
  }
}

applyFSM(Diary);
