/* eslint-disable no-underscore-dangle */
import { getSyncOperationRunner } from '@infra/support/operation-runner';

import { loop, getLifecycleEvenName } from '@domain/_lib/base-methods';
import { BaseEntity } from '../../_lib';
import { errors } from '../../errors';
import { SeniorityType as states } from '../../states';
import { SeniorityTypeId, Day, Diary } from '../../common-types';

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

const transitions = {
  UPDATE: 'update',
  ADD_AWARD: 'addAward',
  DELETE_AWARD_AT: 'deleteAwardAt',
  UPDATE_AWARD_TO: 'updateAwardTo',
  DELETE: 'delete',
  RESTORE: 'restore',
};

export default class SeniorityType extends BaseEntity {
  static restore({ name, months, state, awards, ...props }) {
    const seniorityType = new SeniorityType({
      name,
      months,
      ...props,
    });
    seniorityType._awards = Diary.restore(awards);
    seniorityType.setState(state);

    return seniorityType;
  }

  static instanceAt(
    { seniorityTypeId, name, _awards, months, state, ...props },
    day = new Day()
  ) {
    const seniorityType = new SeniorityType({
      seniorityTypeId,
      name,
      months,
      ...props,
    });
    seniorityType._awards = Diary.instanceAt(_awards, day);
    seniorityType.setState(state);

    return seniorityType;
  }

  static fsm = {
    init: states.ACTIVE,
    transitions: [
      { name: transitions.UPDATE, from: '*', to: loop },
      {
        name: transitions.ADD_AWARD,
        from: states.ACTIVE,
        to: states.ACTIVE,
      },
      {
        name: transitions.DELETE_AWARD_AT,
        from: states.ACTIVE,
        to: states.ACTIVE,
      },
      {
        name: transitions.UPDATE_AWARD_TO,
        from: states.ACTIVE,
        to: states.ACTIVE,
      },
      {
        name: transitions.RESTORE,
        from: states.ACTIVE,
        to: states.DELETED,
      },
      { name: transitions.DELETE, from: states.DELETED, to: states.ACTIVE },
    ],

    methods: {
      onInvalidTransition(_, from) {
        switch (from) {
          case states.DELETED:
            throw errors.seniorityTypeIsDeleted();

          case states.ACTIVE:
            throw errors.seniorityTypeIsActive();

          default:
            throw errors.transitionNotAllowed();
        }
      },

      [getLifecycleEvenName('before', transitions.UPDATE)](
        _,
        { name, months }
      ) {
        this.name = name || this.name;
        this.months = months || this.months;
      },

      [getLifecycleEvenName('before', transitions.ADD_AWARD)](
        _,
        value,
        day = new Day()
      ) {
        return diaryOperationRunner(() => this._awards.add(value, day));
      },

      [getLifecycleEvenName('before', transitions.DELETE_AWARD_AT)](
        _,
        day = new Day()
      ) {
        return diaryOperationRunner(() => this._awards.deleteAt(day));
      },

      [getLifecycleEvenName('before', transitions.UPDATE_AWARD_TO)](
        _,
        day,
        newValue,
        newDay
      ) {
        return diaryOperationRunner(() =>
          this._awards.updateTo(day, newValue, newDay)
        );
      },
      [getLifecycleEvenName('after', transitions.DELETE)]() {
        this.deletedAt = new Date();
      },

      [getLifecycleEvenName('after', transitions.RESTORE)]() {
        this.deletedAt = null;
      },
    },
  };

  constructor({
    seniorityTypeId = new SeniorityTypeId(),
    name,
    months,
    ...props
  }) {
    super({ id: seniorityTypeId, ...props });
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
