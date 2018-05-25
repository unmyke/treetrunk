import { BaseValue } from '../../_lib';

export class Appointment extends BaseValue {
  constructor({ postId, day }) {
    super();
    this.postId = postId;
    this.day = day;
  }

  toJSON() {
    return {
      postId: this.postId.toJSON(),
      date: this.day.toJSON(),
    };
  }
}
