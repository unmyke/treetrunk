import { applyFSM, getDayComparator } from '../../_lib/BaseMethods';
import { errors } from '../../errors';
import { BaseClass } from '../../_lib';
import { Day } from '../Day';
import { Store } from './Store';

const states = {
  NEW: 'new',
  STARTED: 'started',
  CLOSED: 'closed',
};

const transitions = {
  ADD: 'add',
  DELETE_AT: 'deleteAt',
  UPDATE_TO: 'updateTo',
  ADD_CLOSE_AT: 'addCloseAt',
  DELETE_CLOSE: 'deleteClose',
  UPDATE_CLOSE_TO: 'updateCloseTo',
};

const stateTransitionFunctions = {
  deleteAt: function() {
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

export class Diary extends BaseClass {
  // factory
  static restore(records = [], closeValue) {
    const diary = new Diary();

    try {
      records
        .sort(getDayComparator('asc', ({ day }) => day))
        .forEach(({ value, day }) => {
          if (value === closeValue) {
            diary.addCloseAt(day);
          } else {
            diary.add(value, day);
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

    if (archiveLastDay < day) {
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

    transitions: [
      {
        name: transitions.ADD,
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
      onInvalidTransition(transition, from) {
        switch (transition) {
          case transitions.DELETE_AT:
            throw errors.diaryNotStarted();

          case transitions.UPDATE_TO:
            throw errors.diaryNotStarted();

          case transitions.ADD_CLOSE_AT:
            throw errors.diaryNotStarted();

          case transitions.DELETE_CLOSE:
            throw errors.diaryNotClosed();

          case transitions.UPDATE_CLOSE_TO:
            throw errors.diaryNotClosed();

          default:
            throw errors.transitionNotAllowed();
        }
      },

      // operaton validations
      onBeforeAdd(lifecycle, value, day) {
        this._checkAdd(value, day);
      },

      onBeforeDeleteAt(lifecycle, day) {
        this._checkDeleteAt(day);
      },

      onBeforeUpdateTo(lifecycle, day, newValue, newDay) {
        this._checkUpdateTo(day, newValue, newDay);
      },

      onBeforeAddCloseAt(lifecycle, day) {
        this._checkAddCloseAt(day);
      },

      onBeforeUpdateCloseTo(lifecycle, day) {
        this._checkUpdateCloseTo(day);
      },

      // operatons
      onAdd(lifecycle, value, day) {
        return this._store.add(value, day);
      },

      onDeleteAt(lifecycle, day) {
        return this._store.delete(day);
      },

      onUpdateTo(lifecycle, day, newValue, newDay) {
        return this._store.update(day, newValue, newDay);
      },

      onAddCloseAt(lifecycle, day) {
        this._archive.add(this._store, day);

        this._store = new Store();
      },

      onDeleteClose(lifecycle) {
        const { value, day } = this._archive.last;

        this._store = value;
        this._archive.delete(day);
      },

      onUpdateCloseTo(lifecycle, newDay) {
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

  //    operations
  map(fn) {
    return this._store.map(fn);
  }

  reduce(fn) {
    return this._store.reduce(fn);
  }

  filter(fn) {
    const diary = new Diary();
    diary.store.this._store.filter(fn);

    return diary;
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
      dstNeighbours.isExists() && srcRecord.prev.equals(dstNeighbours.prev)
    );
  }

  //      ruleset rules
  _diaryNotClosed(day) {
    if (this._getLastCloseDay() > day) {
      throw errors.diaryClosed();
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
