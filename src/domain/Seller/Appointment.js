import { BaseValue } from '../lib/BaseClasses';
import { addDateAccessors } from '../lib/functions';

export class Appointment extends BaseValue {
  constructor({ postId, date }) {
    super();
    this.postId = postId;
    this.date = date;
  }
}

addDateAccessors(Appointment);
