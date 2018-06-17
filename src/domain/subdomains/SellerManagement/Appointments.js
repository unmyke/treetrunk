import { PostId, DiaryComposite } from '../../commonTypes';
import { Appointment } from './Appointment';

const diaryArgsMap = {
  record: 'appointment',
  newRecord: 'newAppointment',
  newRecords: 'newAppointments',
};

export class Appointments extends DiaryComposite {
  constructor() {
    super({
      closeValue: PostId.quitPostId,
      RecordClass: Appointment,
      mapper: diaryArgsMap,
    });
  }
}
