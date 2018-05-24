import { BaseEntity } from '../../_lib';
import { SeniorityTypeId, Day } from '../../commonTypes';
import { Award } from './Award';

export class SeniorityType extends BaseEntity {
  constructor({ seniorityTypeId = new SeniorityTypeId(), name, months }) {
    super(seniorityTypeId);
    this.name = name;
    this.months = months;
    this.awards = [];
  }

  get award() {
    return this.getAwardValueAt();
  }

  update({ name, months }) {
    const errors = [];
    if (name === this.name) {
      errors.push(`SeniorityType already has name "${name}"`);
    }
    if (months === this.months) {
      errors.push(`SeniorityType already has months "${months}"`);
    }

    if (errors.length > 0) {
      throw this.constructor.errorFactory.createNothingToUpdate(
        this,
        ...errors
      );
    }
    this.name = name;
    this.months = months;
  }

  setAwards(awards) {
    this.awards = awards.map(({ value, day }) => new Award({ value, day }));
  }

  addAward(value, day = new Day()) {
    const award = new Award({ value, day });
    this._checkAwardUniqueness(award);

    this.awards = [...this.awards, award].sort(this._dayComparator);
  }

  editAward(valueToEdit, dayToEdit, value, day) {
    const awardToEdit = new Award({ value: valueToEdit, day: dayToEdit });
    const award = new Award({ value, day });

    if (awardToEdit.equals(award)) {
      throw this.constructor.errorFactory.createNothingToUpdate(
        award,
        `Updated award at ${day.format('DD.MM.YYYY')} for seniority type "${
          this.name
        }" already equlas ${value}%`
      );
    }

    this.addAward(value, day);
    this.deleteAward(valueToEdit, dayToEdit);
  }

  deleteAward(value, day) {
    const seniorityTypeToDelete = new Award({ value, day });
    const filteredAwards = this.awards.filter(
      (award) => !award.equals(seniorityTypeToDelete)
    );
    if (this.awards.length === filteredAwards.length) {
      throw this.constructor.errorFactory.createNotFound(
        seniorityTypeToDelete,
        `Award with value ${value} at ${day.format('DD.MM.YYYY')} not found`
      );
    }

    this.awards = filteredAwards;
  }

  getAwardValueAt(day = new Day()) {
    if (!this.hasAward(day)) {
      return;
    }

    const [firstAward, ...restAwards] = this.awards;

    const { value } = restAwards.reduce((award, currentAward) => {
      return currentAward.day <= day ? currentAward : award;
    }, firstAward);

    return value;
  }

  hasAward(day = new Day()) {
    const [firstAward] = this.awards;
    return !!firstAward && firstAward.day <= day;
  }

  toJSON() {
    return {
      seniorityTypeId: this.seniorityTypeId,
      name: this.name,
      months: this.months,
      award: this.award,
      awards: this.awards.map((award) => award.toJSON()),
    };
  }

  // private

  _checkAwardUniqueness(award) {
    if (this._isAwardExistsAt(award.day)) {
      throw this.constructor.errorFactory.createAlreadyExists(
        award,
        `Award at ${award.day.format('DD.MM.YYYY')} already exists`
      );
    }

    const prevValue = this.getAwardValueAt(award.day);
    if (award.value === prevValue) {
      throw this.constructor.errorFactory.createAlreadyExists(
        award,
        `Award value at ${award.day.format('DD.MM.YYYY')} already equals "${
          award.value
        }"`
      );
    }
  }

  _isAwardExistsAt(day = new Day()) {
    const index = this.awards.findIndex(({ day: currentDay }) =>
      day.equals(currentDay)
    );

    return index !== -1;
  }
}
