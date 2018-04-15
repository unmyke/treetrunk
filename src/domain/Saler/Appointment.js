import { BaseValue } from '../lib';

export class Appointment extends BaseValue {
  constructor({ postId, date }) {
    super();
    this.postId = postId;
    this.date = date;
  }
}
