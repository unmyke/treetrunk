import { BaseEntity } from '../_lib/BaseClasses';
import { Day } from '../_lib/ValueObjects';
import { SeniorityTypeId } from './SeniorityTypeId';
import { Award } from './Award';

export class SeniorityType extends BaseEntity {
  constructor({ seniorityTypeId = new SeniorityTypeId(), name, months }) {
    super(seniorityTypeId);
    this.name = name;
    this.months = months;
    this.awards = [];
  }

  addAward(value, day = new Day()) {
    const award = new Award({ value, day });
    this.awards = [...this.awards, award].sort((a, b) => a.day > b.day);
  }

  deleteAward(value, day = new Day()) {
    const awardToDelete = new Award({ value, day });
    const filteredAwards = this.awards.filter((award) =>
      award.equals(awardToDelete)
    );

    if (filteredAwards.length === this.awards.length) {
      throw new Error('NotFound');
    }

    this.awards = filteredAwards;
  }

  editAward(value, day, updateValue, updateDay) {
    this.deleteAward(value, day);
    this.addAward(updateValue, updateDay);
  }
}
