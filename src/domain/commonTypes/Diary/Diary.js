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
  DELETE_RECORD_AT: 'deleteRecordAt',
  UPDATE_RECORD_TO: 'updateRecordTo',
  ADD_CLOSE_AT: 'addCloseAt',
  DELETE_CLOSE: 'deleteClose',
  UPDATE_CLOSE_TO: 'updateCloseTo',
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

const isEqualValues = (value1, value2) => {
  if (value1 instanceof BaseValue) {
    return value1.equals(value2);
  }

  return value1 === value2;
};

const calculateState = (RecordClass, records, closeDays) => {
  const hasDublicates = () => {
    if (flatDiary.length === 0) {
      return false;
    }

    const [firstRecord, ...restRecords] = flatDiary;

    const { isDublicate } = restRecords.reduce(
      (result, currentRecord) => {
        const { isDublicate, record } = result;

        const newIsDublicate =
          isDublicate ||
          isEqualValues(
            record[RecordClass.valuePropName],
            currentRecord[RecordClass.valuePropName]
          );

        return {
          isDublicate: newIsDublicate,
          record: currentRecord,
        };
      },
      { isDublicate: false, record: firstRecord }
    );

    return isDublicate;
  };

  const recordsHasEmptyValues = () => {
    return records.includes(
      ({ [RecordClass.valuePropName]: value }) => value === undefined
    );
  };

  const recordsIsNotInstanceofRecordClass = () => {
    if (records.length === 0) {
      return false;
    }

    const [firstRecord, ...restRecords] = records;

    return restRecords.reduce(
      (isNotInstanceofRecordClass, currentRecord) =>
        isNotInstanceofRecordClass && !currentRecord instanceof RecordClass,
      !firstRecord instanceof RecordClass
    );
  };

  const hasRecordsOnSameDay = () => {
    return (
      flatDiary.length !==
      new Set(flatDiary.map(({ day }) => day.valueOf())).size
    );
  };

  const hasCloseOnStart = () => {
    return (
      flatDiary.length > 0 &&
      flatDiary[0][RecordClass.valuePropName] === undefined
    );
  };

  const closeRecords = closeDays.map(
    (day) =>
      new RecordClass({
        day,
      })
  );

  const flatDiary = [...records, ...closeRecords].sort(
    getDayComparator('asc', ({ day }) => day)
  );

  if (
    recordsHasEmptyValues() ||
    recordsIsNotInstanceofRecordClass() ||
    hasRecordsOnSameDay() ||
    hasCloseOnStart() ||
    hasDublicates()
  ) {
    throw errors.inconsistentState();
  }

  switch (true) {
    case flatDiary.length === 0:
      return states.NEW;

    case flatDiary[flatDiary.length - 1][RecordClass.valuePropName] ===
      undefined:
      return states.CLOSED;

    default:
      return states.STARTED;
  }
};

export class Diary extends BaseClass {
  // factory
  static restore(RecordClass, records = [], closeDays = []) {
    const diary = new Diary({ RecordClass });
    diary._records = records;
    diary._closeDays = closeDays;
    diary.setState(calculateState(RecordClass, records, closeDays));

    return diary;
  }

  static instanceAt({ RecordClass, _records, _closeDays }, day = new Day()) {
    const records = _records.filter(({ day: currentDay }) => currentDay <= day);
    const closeDays = _closeDays.filter((currentDay) => currentDay <= day);

    return this.restore(RecordClass, records, closeDays);
  }

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
      onBeforeAddRecord(lifecycle, record) {
        if (this._getLastCloseDay() > record.day) {
          throw errors.diaryClosed();
        }

        if (this._hasRecordsOn(record.day)) {
          throw errors.recordAlreadyExists();
        }

        if (this._hasDublicateAt(record)) {
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

      onBeforeAddCloseAt({ from, to }, day) {
        if (this._getLastCloseDay() > day) {
          throw errors.diaryClosed();
        }
      },

      onBeforeAddCloseAt({ from, to }, day) {
        if (this._getLastCloseDay() > day) {
          throw errors.diaryClosed();
        }
      },

      onBeforeUpdateCloseTo({ from, to }, day) {
        if (this._hasRecordsAtOrAfter(day)) {
          throw errors.diaryHasRecordsLater();
        }
      },

      // operatons
      onAddRecord({ from }, record) {
        this._records = [...this._records, record];

        if (from !== states.STARTED) {
          this.startDay = record.day;
        }
      },

      onDeleteRecordAt({ to }, day) {
        this._records = this._records.filter(
          ({ day: currentDay }) => !currentDay.equals(day)
        );

        if (to !== states.STARTED) {
          this.startDay = undefined;
        }
      },

      onUpdateRecordTo({ from, to }, day, newRecord) {
        this._records = [
          ...this._records.filter(
            ({ day: currentDay }) => !currentDay.equals(day)
          ),
          newRecord,
        ];
      },

      onAddCloseAt({ from, to }, day) {
        this._closeDays = [...this._closeDays, day];

        this.startDay = undefined;
      },

      onDeleteClose({ from, to }) {
        const lastCloseDay = this._getLastCloseDay();

        this._closeDays = this._closeDays.filter(
          (day) => !day.equals(lastCloseDay)
        );
      },

      onUpdateCloseTo({ from, to }, day) {
        const lastCloseDay = this._getLastCloseDay();

        this._closeDays = [
          ...this._closeDays.filter((day) => !day.equals(lastCloseDay)),
          day,
        ];
      },
    },
  };

  constructor({ RecordClass }) {
    super();

    this.RecordClass = RecordClass;

    this._records = [];
    this._closeDays = [];
    this.startDay = undefined;

    this._fsm();
  }

  // getters

  //   public metods
  get records() {
    const lastCloseDay = this._getLastCloseDay();
    const records = this._getRecords();

    if (lastCloseDay === undefined) {
      return records;
    }

    return this._getRecords().filter(({ day }) => day > lastCloseDay);
  }

  get record() {
    return this.records[this.records.length - 1];
  }

  get recordValue() {
    const record = this.record;

    return record !== undefined ? record.value : undefined;
  }

  get closeDay() {
    const record = this.record;
    const lastCloseDay = this._getLastCloseDay();

    if (record === undefined) {
      return lastCloseDay;
    }

    return undefined;
  }

  //   private metods
  _hasRecordsAtOrAfter(day) {
    return (
      this._getRecords().filter(({ day: currentDay }) => currentDay >= day)
        .length !== 0
    );
  }

  _hasDublicateAt({ [this.RecordClass.valuePropName]: value, day }) {
    const neighbors = this._getNeighborsRecordAt(day);

    return neighbors.isEqualTo(value);
  }

  _hasRecordsOn(day = new Day()) {
    return this._getRecordOn(day) !== undefined;
  }

  _getNeighborsRecordAt(day = new Day(), { excludeDay } = {}) {
    const initNeighbors = {
      prev: undefined,
      next: undefined,

      isExist: function() {
        return this.prev !== undefined && this.next !== undefined;
      },

      isEqual: function() {
        return isEqualValues(this.prev.value, this.next.value);
      },

      isEqualTo: function(value) {
        return (
          isEqualValues(value, this.prev.value) ||
          isEqualValues(value, this.next.value)
        );
      },
    };

    return this.records.reduce((neighbors, currentRecord) => {
      const newNeighbors = { ...neighbors };

      if (excludeDay === undefined || currentRecord.day.equals(excludeDay)) {
        if (currentRecord.day < day) newNeighbors.prev = currentRecord;
        if (currentRecord.day > day) newNeighbors.next = currentRecord;
      }

      return newNeighbors;
    }, initNeighbors);
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
    return this._records.sort(getDayComparator('asc', ({ day }) => day));
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
