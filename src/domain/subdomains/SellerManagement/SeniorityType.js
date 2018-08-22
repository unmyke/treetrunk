import { BaseEntity } from '../../_lib';
import { SeniorityTypeId, Day, Diary } from '../../commonTypes';

export class SeniorityType extends BaseEntity {
  static fsm = {
    init: 'active',
    transitions: [
      { name: 'inactivate', from: 'active', to: 'inactive' },
      { name: 'activate', from: 'inactive', to: 'active' },
      { name: 'update', from: 'active', to: 'active' },
      { name: 'setAwards', from: 'active', to: 'active' },
      { name: 'addAward', from: 'active', to: 'active' },
      { name: 'deleteAward', from: 'active', to: 'active' },
      { name: 'editAward', from: 'active', to: 'active' },
      { name: 'setState', from: ['active', 'inactive'], to: (state) => state },
    ],
    methods: {
      onActive() {
        this.awardOperationResult = { done: true };
      },

      // update({ name })
      onBeforeUpdate(lifecycle, { name }) {
        const errors = [];
        if (name === this.name) {
          // throw this.constructor.errorFactory.createNothingToUpdate(
          //   this,
          //   `SeniorityType in ${
          //     this.state
          //   } state already has name "${name}" and months "${months}"`
          // );
        }
      },

      onUpdate(lifecycle, { name }) {
        this.name = name;
        this.months = months;
      },

      // setAwards([{ value, day }])
      onSetAwards(lifecycle, awardEntries) {
        const awards = awardEntries.map(
          ({ value, day }) => new Award({ value, day })
        );

        return this._emitAwardOperation('setItems', awards);
      },

      // addAward(value, day)
      onAddAward(lifecycle, value, day = new Day()) {
        const award = new Award({ value, day });

        return this._emitAwardOperation('addItem', award);
      },

      // deleteAward(value, day)
      onDeleteAward(lifecycle, value, day = new Day()) {
        const award = new Award({ value, day });

        return this._emitAwardOperation('deleteItem', award);
      },

      // editAward(value, day, newValue, newDay)
      onEditAward(lifecycle, value, day, newValue, newDay) {
        const award = new Award({ value, day });
        const newAward = new Award({
          value: newValue,
          day: newDay,
        });

        return this._emitAwardOperation('editItem', award, newAward);
      },
    },
  };

  constructor({
    seniorityTypeId = new SeniorityTypeId(),
    name,
    months,
    state = 'active',
  }) {
    super(seniorityTypeId);
    this.name = name;
    this.months = months;
    this._awards = new Diary();

    this.setState(state);
  }

  get awards() {
    return this._awards.items;
  }

  get award() {
    return this._awards.getItemValueAt();
  }

  get hasAwards() {
    return this._awards.hasItems;
  }

  getAwardAt(day = new Day()) {
    return this._awards.getItemValueAt(day);
  }

  hasAwardsAt(day = new Day()) {
    return this._awards.hasItemsAt(day);
  }

  getInstanceAt(day = new Day()) {
    const seniorityType = new SeniorityType(this);

    const awards = this._awards.getItemsAt(day);
    seniorityType.setAwards(awards);

    return seniorityType;
  }

  toJSON() {
    return {
      seniorityTypeId: this.seniorityTypeId.toJSON(),
      name: this.name,
      award: this.award,
      awards: this._awards.map((award) => award.toJSON()),
      state: this.state,
    };
  }

  // private

  _emitAwardOperation(operation, ...args) {
    const { done, errors } = this._awards[operation](...args);

    if (!done) {
      throw errors;
    }
    return done;
  }
}
