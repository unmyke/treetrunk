import { BaseDiary } from '../../_lib';
import { PostId } from '../../commonTypes';
import { Appointment } from './Appointment';

export class Appointments extends BaseDiary {
  static closeValue = PostId.quitPostId;
  static RecordClass = Appointment;

  get appointments() {
    return this.records;
  }

  get hasAppointments() {
    return this.hasRecords;
  }

  get postId() {
    return this.recordValue;
  }

  get postIds() {
    return this.recordValues;
  }

  get recriutDay() {
    return this.startDay;
  }

  get isRecriuted() {
    return this.isStarted;
  }

  get quitDay() {
    return this.quitDay;
  }

  get isQuited() {
    return this.isCloseed;
  }
}
