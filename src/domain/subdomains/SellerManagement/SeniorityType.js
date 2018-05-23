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
    const previuosAward = this.getAwardAt(day);
    const award = new Award({ value, day });
    if (previuosAward === award) {
      throw this.constructor.errorDuplication;
    }
    this.awards = [...this.awards, award].sort((a, b) => a.day > b.day);
  }

  deleteAward(value, day) {
    const seniorityTypeToDelete = new Award({ value, day });
    const filteredAwards = this.awards.filter(
      (award) => !award.equals(seniorityTypeToDelete)
    );
    if (this.awards.length === filteredAwards.length) {
      this.constructor.errorNoAwards;
    }

    this.awards = filteredAwards;
  }

  editAward(value, day, updateValue, updateDay) {
    this.deleteAward(value, day);
    this.addAward(updateValue, updateDay);
  }

  getAwardAt(day = new Day()) {
    if (!this.hasAward(day)) {
      return;
    }

    const [firstAward, ...restAwards] = this.awards;

    const { value } = restAwards.reduce((award, appointment) => {
      return appointment.day <= day ? appointment : award;
    }, firstAward);

    return value;
  }

  hasAward(day) {
    const [firstAward] = this.awards;
    return !!firstAward && firstAward.day <= day;
  }

  get Award() {
    return this.getAwardAt();
  }
}

// addErrorDefinitionProperty(
//   SeniorityType,
//   'errorDuplication',
//   'OperationError',
//   'SeniorityType already have this award'
// );
// addErrorDefinitionProperty(
//   SeniorityType,
//   'errorNoAwards',
//   'OperationError',
//   'SeniorityType have not such award'
// );
