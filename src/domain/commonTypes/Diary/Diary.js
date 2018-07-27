import { applyFSM, getDayComparator } from '../../_lib/BaseMethods';
import { errors } from '../../errors';
import { BaseClass, BaseValue } from '../../_lib';
import { Day } from '../Day';
import { OperationRuleSet } from './OperationRuleSet';

const states = {
  NEW: 'new',
  STARTED: 'started',
  CLOSED: 'closed',
};

const transitions = {
  ADD_RECORD: 'addRecord',
  DELETE_RECORD: 'deleteRecord',
  UPDATE_RECORD: 'updateRecord',
  ADD_CLOSE_DAY: 'addCloseDay',
  DELETE_CLOSE_DAY: 'deleteCloseDay',
  UPDATE_CLOSE_DAY: 'updateCloseDay',
};

const stateTransitionFunctions = {
  deleteRecord: function() {
    switch (true) {
      case this._records.length === 1:
        return states.NEW;

      case this.records.length === 1:
        return states.CLOSED;

      default:
        return states.STARTED;
    }
  },
};

const calculateState = (_records, _closeDays) => {
  const recordDays = _records.map(({ day }) => day.valueof()).sort();
  const closeDays = _closeDays.map((day) => day.valueof()).sort();

  const allDays = [...recordDays, ...closeDays];

  if (new Set(allDays).size === allDays.length) {
    switch (true) {
      case recordDays.length === 0 && closeDays.length === 0:
        return states.NEW;

      case recordDays.length !== 0 && closeDays.length !== 0:
        switch (true) {
          case value:
            break;

          default:
            break;
        }

      default:
        break;
    }
  } else {
    throw errors.inconsistentState();
  }
};

export class Diary extends BaseClass {
  // factory
  restore({ closeValue, RecordClass, records = [], closeDays = [] }) {
    const diary = new Diary({ closeValue, RecordClass });

    const state = calculateState(records, closeDays);

    diary._records = records;
    diary._closeDays = closeDays;

    diary.setState(state);

    return diary;
  }

  // FSM

  static fsm = {
    getRawState: function(diary) {
      switch (true) {
        case diary._records.length === 0:
          return states.NEW;

        case diary.records.length === 0:
          return states.CLOSED;

        default:
          return states.STARTED;
      }
    },

    init: states.NEW,

    transitions: [
      {
        name: transitions.ADD_RECORD,
        from: [states.NEW, states.STARTED, states.CLOSED],
        to: states.STARTED,
      },
      {
        name: transitions.DELETE_RECORD,
        from: states.STARTED,
        to: stateTransitionFunctions.deleteRecord,
      },
      {
        name: transitions.UPDATE_RECORD,
        from: states.STARTED,
        to: states.STARTED,
      },
      {
        name: transitions.ADD_CLOSE_DAY,
        from: states.STARTED,
        to: states.CLOSED,
      },
      {
        name: transitions.DELETE_CLOSE_DAY,
        from: states.CLOSED,
        to: states.STARTED,
      },
      {
        name: transitions.UPDATE_CLOSE_DAY,
        from: states.CLOSED,
        to: states.CLOSED,
      },
    ],

    methods: {
      onInvalidTransition(transition, from) {
        switch (transition) {
          case transitions.DELETE_RECORD:
            throw errors.diaryNotStarted();

          case transitions.UPDATE_RECORD:
            throw errors.diaryNotStarted();

          case transitions.ADD_CLOSE_DAY:
            throw errors.diaryNotStarted();

          case transitions.DELETE_CLOSE_DAY:
            throw errors.diaryNotClosed();

          case transitions.UPDATE_CLOSE_DAY:
            throw errors.diaryNotClosed();

          default:
            throw errors.transitionNotAllowed();
        }
      },

      onBeforeTransition({ transition }, args) {
        if (Object.values(transitions).includes(transition)) {
          const operationRuleSet = new OperationRuleSet({
            operatee: this,
            operationName: transition,
          });

          operationRuleSet.check(args);
        }
      },

      onTransition({ transition }, args) {
        if (Object.values(transitions).includes(transition)) {
          this[`_${transition}`](args);
        }
      },

      onAddRecord(
        { from, to },
        {
          record: { day },
        }
      ) {
        switch (true) {
          case from !== states.STARTED:
            this.startDay = day;
            break;

          default:
            break;
        }
      },

      onAddCloseDay({ from, to }, { day }) {
        this.c;
      },
    },
  };

  constructor({ closeValue, RecordClass }) {
    super();

    this.closeValue = closeValue;
    this.RecordClass = RecordClass;

    this._records = [];
    this._closeDays = [];

    this._runFSM();
  }

  // getters

  //   public metods
  get records() {
    return this._getRecordsAt();
  }

  get allRecords() {
    return [
      ...this._records,
      ...this._closeDays.map(
        (day) =>
          new this.RecordClass({
            [RecordClass.valuePropName]: this.closeValue,
            day,
          })
      ),
    ].sort(getDayComparator('asc', (item) => item.day));
  }

  //   public metods

  _getRecordsAt(day = new Day()) {
    const closeDay = this._getCloseDayBefore(day);

    return;
  }

  _getCloseDayAt(day = new Day()) {
    const [firstCloseDay, ...restCloseDays] = this._getCloseDaysAt(day);

    return closeDays.reduce();
  }

  _getCloseDayAfter(day = new Day()) {
    const closeDaysAfter = this._getCloseDays.filter(
      (currentCloseDay) => currentCloseDay > day
    );
    return closeDaysAfter[0];
  }

  _getCloseDayBefore(day = new Day()) {
    const closeDaysBefore = this._getCloseDays.filter(
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

  //  private methods

  //    primitive oparations
  _addRecord({ record }) {
    this._records = [...this._records, record];
  }

  _deleteRecord({ day }) {
    this._records = this._records.filter(
      ({ day: currentDay }) => !currentDay.equals(day)
    );
  }

  _updateRecord({ day, newRecord }) {
    this._deleteRecord({ day });
    this._addRecord({ record: newRecord });
  }

  _addCloseDay({ day }) {
    this._closeDays = [..._closeDays, day];
  }

  _deleteCloseDay() {
    const lastCloseDay = Math.max(this._closeDays);

    this._closeDays = this._closeDays.filter(
      (day) => !day.equals(lastCloseDay)
    );
  }

  _updateCloseDay({ day }) {
    this._deleteCloseDay();
    this._addCloseDay({ day });
  }
}

applyFSM(Diary);
