import { BaseEntity } from '../../_lib';
import { SeniorityTypeId, Day } from '../../commonTypes';
import { Award } from './Award';
// import { addErrorDefinitionProperty } from 'src/infra/support/addErrorDefinition';

export class SeniorityType extends BaseEntity {
  constructor({ seniorityTypeId = new SeniorityTypeId(), name, months }) {
    super(seniorityTypeId);
    this.name = name;
    this.months = months;
    this.awards = [];
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

    const { value } = restAwards.reduce((currentAward, appointment) => {
      return appointment.day <= day ? appointment : currentAward;
    }, firstAward);

    return value;
  }

  hasAward(day) {
    const [firstAward] = this.awards;
    return !!firstAward && firstAward.day <= day;
  }

  get currentAward() {
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
