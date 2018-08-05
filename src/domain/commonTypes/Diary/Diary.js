import {
  applyFSM,
  getDayComparator,
  isEqualValues,
} from '../../_lib/BaseMethods';
import { errors } from '../../errors';
import { BaseClass } from '../../_lib';
import { Day } from '../Day';
import { Store } from './Store';
import { Archive } from './Archive';

const states = {
  NEW: 'new',
  STARTED: 'started',
  CLOSED: 'closed',
};

const transitions = {
  ADD_RECORD: 'addRecord',
  DELETE_RECORD_AT: 'deleteRecordAt',
  UPDATE_RECORD_TO: 'updateRecordTo',
  ADD_CLOSE_AT: 'addCloseAt',
  DELETE_CLOSE: 'deleteClose',
  UPDATE_CLOSE_TO: 'updateCloseTo',
};

const stateTransitionFunctions = {
  deleteRecord: function() {
    if (this._store.size === 1) {
      if (this._archive === 0) {
        return states.NEW;
      }

      return states.CLOSED;
    }

    return states.STARTED;
  },
};

const calculateState = ({ _records, _archive }) => {
  if (_records.size === 0) {
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
            diary.addRecord(value, day);
          }
        });
      return diary;
    } catch (error) {
      throw errors.inconsistentState();
    }
  }

  static instanceAt({ _records, _archive }, day = new Day()) {}

  // FSM

  static fsm = {
    init: states.NEW,

    transitions: [
      {
        name: transitions.ADD_RECORD,
        from: [states.NEW, states.STARTED, states.CLOSED],
        to: states.STARTED,
      },
      {
        name: transitions.DELETE_RECORD_AT,
        from: states.STARTED,
        to: stateTransitionFunctions.deleteRecord,
      },
      {
        name: transitions.UPDATE_RECORD_TO,
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
          case transitions.DELETE_RECORD_AT:
            throw errors.diaryNotStarted();

          case transitions.UPDATE_RECORD_TO:
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
      onBeforeAddRecord(lifecycle, value, day) {
        if (this._getLastCloseDay() > day) {
          throw errors.diaryClosed();
        }

        if (this._hasRecordsOn(day)) {
          throw errors.recordAlreadyExists();
        }

        if (this._hasDublicateWith(value, day)) {
          throw errors.recordDuplicate();
        }
      },

      onBeforeDeleteAt(lifecycle, day) {
        if (this._getLastCloseDay() > day) {
          throw errors.diaryClosed();
        }

        if (this._hasRecordsOn(day) == undefined) {
          throw errors.recordNotFound();
        }

        if (this._getNeighborsRecordAt(day).isEqual()) {
          throw errors.recordHasEqualNeightbors();
        }
      },

      onBeforeUpdateTo(lifecycle, day, newRecord) {
        const lastCloseDay = this._getLastCloseDay();

        if (lastCloseDay > day || lastCloseDay > newRecord.day) {
          throw errors.diaryClosed();
        }

        if (this._hasRecordsOn(day) === undefined) {
          throw errors.recordNotFound();
        }

        const srcNeighbors = this._getNeighborsRecordAt(day);
        const dstNeighbors = this._getNeighborsRecordAt(newRecord.day, {
          excludeDay: day,
        });

        if (
          !srcNeighbors.isExist ||
          !dstNeighbors.isExist ||
          !srcNeighbors.prev.equals(dstNeighbors.prev)
        ) {
          if (srcNeighbors.isEqual()) {
            throw errors.recordHasLimitedScope();
          }

          if (this._hasRecordsOn(newRecord.day)) {
            throw errors.recordAlreadyExists();
          }
        }

        if (dstNeighbors.isEquals(newRecord.value)) {
          throw errors.recordDuplicate();
        }
      },

      onBeforeAddCloseAt(lifecycle, day) {
        if (this._getLastCloseDay() > day) {
          throw errors.diaryClosed();
        }
      },

      onBeforeAddCloseAt(lifecycle, day) {
        if (this._getLastCloseDay() > day) {
          throw errors.diaryClosed();
        }
      },

      onBeforeUpdateCloseTo(lifecycle, day) {
        if (this._hasRecordsAtOrAfter(day)) {
          throw errors.diaryHasRecordsLater();
        }
      },

      // operatons
      onAddRecord({ from }, value, day) {
        this._store.add(value, day);

        if (from !== states.STARTED) {
          this.startDay = day;
        }
      },

      onDeleteRecordAt({ to }, day) {
        this._store.delete(day);

        if (to !== states.STARTED) {
          this.startDay = undefined;
        }
      },

      onUpdateRecordTo(lifecycle, day, newValue, newDay) {
        this._store.update(day, newValue, newDay);
      },

      onAddCloseAt(lifecycle, day) {
        this._archive.add(day, this._store);

        this._store = new Store();
      },

      onDeleteClose(lifecycle) {
        this._store = this._archive.restoreLast();
      },

      onUpdateCloseTo(lifecycle, day) {
        const last = this._archive.restoreLast();
        this._archive.add(day, last);
      },
    },
  };

  constructor() {
    super();

    this._store = new Store();
    this._archive = new Archive();

    this._fsm();
  }

  // getters

  //   public metods
  get records() {
    return this._store.all;
  }

  get startDay() {
    const firstRecord = this._store.first;

    return firstRecord !== undefined ? firstRecord.day : undefined;
  }

  get closeDay() {
    return this._archive.lastDay;
  }

  get recordValue() {
    const lastRecord = this._store.last;

    return lastRecord !== undefined ? lastRecord.value : undefined;
  }

  //   private metods
  _hasRecordsAtOrAfter(day) {
    return (
      this._getRecords().filter(({ day: currentDay }) => currentDay >= day)
        .length !== 0
    );
  }

  _hasDublicateWith({ [this.RecordClass.valuePropName]: value, day }) {
    const neighbors = this._getNeighborsRecordAt(day);
    console.log(neighbors);
    console.log(value);
    console.log(neighbors.isEqualTo(value));

    return neighbors.isEqualTo(value);
  }

  _hasRecordsOn(day = new Day()) {
    return this._getRecordOn(day) !== undefined;
  }

  _getNeighborsRecordAt(day = new Day(), options = {}) {
    return Neighbors.create(day, this.records, options);
  }

  _getRecordOn(day = new Day()) {
    return this.records.find(({ day: currentDay }) => currentDay.equals(day));
  }

  _getLastCloseDay() {
    return this._isCloseDay() ? new Day() : this._getCloseDayBefore();
  }

  _getCloseDayAfter(day = new Day()) {
    const closeDaysAfter = this._getCloseDays().filter(
      (currentCloseDay) => currentCloseDay > day
    );
    return closeDaysAfter[0];
  }

  _getCloseDayBefore(day = new Day()) {
    const closeDaysBefore = this._getCloseDays().filter(
      (currentCloseDay) => currentCloseDay < day
    );
    return closeDaysBefore[closeDaysBefore.length - 1];
  }

  _isCloseDay(day = new Day()) {
    return (
      this._closeDays.find((currentCloseDay) => currentCloseDay.equals(day)) !==
      undefined
    );
  }

  _getRecords() {
    return this._store.sort(getDayComparator('asc', ({ day }) => day));
  }

  _getCloseDays() {
    return this._closeDays.sort(getDayComparator('asc'));
  }

  // operations

  //  public methods
  map(fn) {
    return this.records.map(fn);
  }

  reduce(fn) {
    return this.records.reduce(fn);
  }

  filter(fn) {
    return this.records.filter(fn);
  }
}

applyFSM(Diary);
