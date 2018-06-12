import { PostId, Day, Diary } from '../../commonTypes';
import { Appointment } from './Appointment';

export class Appointments extends Diary {
  constructor() {
    super({ closeValue: PostId.quitPostId, RecordClass: Appointment });
  }

  get appointments() {
    return this._records;
  }

  get hasAppointments() {
    return this._hasRecords;
  }

  get postId() {
    return this._recordValue;
  }

  get postIds() {
    return this._recordValues;
  }

  get recriutDay() {
    return this._startDay;
  }

  get isRecruited() {
    return this._isStarted;
  }

  get quitDay() {
    return this._closeDay;
  }

  get isQuited() {
    return this._isClosed;
  }

  getAppointmentsAt(day = new Day(), options = {}) {
    return this._getRecordsAt(day);
  }

  hasAppointmentsAt(day = new Day()) {
    return this._hasRecordsAt(day);
  }

  getPostIdAt(day = new Day()) {
    return this._getRecordValueAt(day);
  }

  getPostIdsAt(day = new Day(), options = {}) {
    return this._getRecordValuesAt(day, options);
  }

  getRecruitDayAt(day = new Day(), options = {}) {
    return this._getStartDayAt(day, options);
  }

  isRecruitedAt(day = new Day()) {
    return this._isStartedAt(day);
  }

  getQuitDayAt(day = new Day()) {
    return this._getCloseDayAt(day);
  }

  isQuitedAt(day = new Day()) {
    return this._isClosedAt(day);
  }

  setAppointments(appointments) {
    return this._setRecords(appointments);
  }

  addAppointment(appointment) {
    return this._addRecord(appointment);
  }

  deleteAppointment(appointment) {
    return this._deleteRecord(appointment);
  }

  editAppointment(appointment, newAppointment) {
    return this._editRecord(appointment, newAppointment);
  }

  takeQuitAt(day) {
    return this._addClosing(day);
  }

  deleteQuitAt(day) {
    return this._deleteClosing(day);
  }
}
