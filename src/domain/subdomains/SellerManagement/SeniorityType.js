import { getSyncOperationRunner } from 'src/infra/support/operationRunner';

import { BaseEntity } from '../../_lib';
import { errors } from '../../errors';
import { SeniorityTypeId, Day, Diary } from '../../commonTypes';

const diaryErrorMessageMapper = {
  RECORD_ALREADY_EXISTS: errors.awardAlreadyExists(),
  RECORD_DUPLICATE: errors.awardDuplicate(),
  RECORD_NOT_FOUND: errors.awardNotFound(),
  RECORD_HAS_EQUAL_NEIGHBOURS: errors.awardHasEqualNeighbours(),
  RECORD_HAS_LIMITED_SCOPE: errors.awardHasLimitedScope(),
  NEW_RECORD_ALREADY_EXISTS: errors.newAwardAlreadyExists(),
  NEW_RECORD_DUPLICATE: errors.newAwardDuplicate(),
};
const diaryOperationRunner = getSyncOperationRunner(diaryErrorMessageMapper);

const states = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

const transitions = {
  UPDATE: 'update',
  ADD_PIECE_RATE: 'addAward',
  DELETE_PIECE_RATE_AT: 'deleteAwardAt',
  UPDATE_PIECE_RATE_TO: 'updateAwardTo',
  ACTIVATE: 'activate',
  INACTIVATE: 'inactivate',
};

export class SeniorityType extends BaseEntity {
  static restore({ seniorityTypeId, name, months, state, awards }) {
    const seniorityType = new SeniorityType({
      seniorityTypeId,
      name,
      months,
      state,
    });
    seniorityType._awards = Diary.restore(awards);
    seniorityType.setState(state);

    return seniorityType;
  }

  static instanceAt({ name, awards, months, state }, day = new Day()) {
    const seniorityType = new SeniorityType({ name, months, state });
    seniorityType._awards = Diary.instanceAt(awards, day);
    seniorityType.setState(state);

    return seniorityType;
  }

  static fsm = {
    init: states.ACTIVE,
    transitions: [
      { name: transitions.UPDATE, from: states.ACTIVE, to: states.ACTIVE },
      {
        name: transitions.ADD_PIECE_RATE,
        from: states.ACTIVE,
        to: states.ACTIVE,
      },
      {
        name: transitions.DELETE_PIECE_RATE_AT,
        from: states.ACTIVE,
        to: states.ACTIVE,
      },
      {
        name: transitions.UPDATE_PIECE_RATE_TO,
        from: states.ACTIVE,
        to: states.ACTIVE,
      },
      {
        name: transitions.INACTIVATE,
        from: states.ACTIVE,
        to: states.INACTIVE,
      },
      { name: transitions.ACTIVATE, from: states.INACTIVE, to: states.ACTIVE },
    ],

    methods: {
      // update({ name })
      onUpdate(lifecycle, { name }) {
        this.name = name;
      },

      onAddAward(lifecycle, value, day = new Day()) {
        return diaryOperationRunner(() => this._awards.add({ value, day }));
      },

      onDeleteAward(lifecycle, day = new Day()) {
        return diaryOperationRunner(() => this._awards.deleteAt(day));
      },

      onUpdateAward(lifecycle, day, newValue, newDay) {
        return diaryOperationRunner(() =>
          this._awards.updateTo(day, newValue, newDay)
        );
      },
    },
  };

  constructor({ seniorityTypeId = new SeniorityTypeId(), name, months }) {
    super(seniorityTypeId);
    this.name = name;
    this.months = months;
    this._awards = new Diary();
  }

  get awards() {
    return this._awards.records;
  }

  get award() {
    return this._awards.recordValue;
  }

  get hasAwards() {
    return this._awards.length !== 0;
  }
}
