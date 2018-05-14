import { BaseValue } from '../../_lib';

export class Appointment extends BaseValue {
  constructor({ postId, day }) {
    super();
    this.postId = postId;
    this.day = day;
  }
}
