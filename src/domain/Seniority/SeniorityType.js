import { BaseEntity } from '../lib/BaseClasses';
import { SeniorityTypeId } from './SeniorityTypeId';
import { Award } from './Award';

export class SeniorityType extends BaseEntity {
  constructor({ seniorityTypeId = new SeniorityTypeId(), name, months }) {
    super(seniorityTypeId);
    this.name = name;
    this.months = months;
    this.awards = [];
  }

  addAwardAt(value, date = new Date()) {
    const award = new Award({ value, date })
    this.awards = [ ...this.awards, award ].sort((a, b) => a.date > b.date);
  }

  deleteAwardAt(value, date = new Date()) {
    const awardToDelete = new Award({ value, date })
    const filteredAwards = this.awards.filter(award => award.equals(awardToDelete));

    if (filteredAwards.length === this.awards.length) {
      throw new Error('NotFound');
    }

    this.awards = filteredAwards;
  }

  updateAwardAt(value, date, updatedValue, updatedDate) {
    this.deleteAwardAt(value, date);
    this.addAwardAt(updatedValue, updatedDate);
  }
}
