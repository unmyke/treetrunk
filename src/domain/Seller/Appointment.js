import { BaseValue } from '../_lib/BaseClasses';

export class Appointment extends BaseValue {
  constructor({ postId, day }) {
    super();
    this.postId = postId;
    this.day = day;
  }
}
