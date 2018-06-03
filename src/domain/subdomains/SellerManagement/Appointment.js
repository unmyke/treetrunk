import { DayMetric } from '../../commonTypes';

export class Appointment extends DayMetric {
  constructor({ postId: value, day }) {
    super({ value, day });
  }

  get postId() {
    return this.value;
  }

  set postId(postId) {
    this.value = postId;
  }
}
