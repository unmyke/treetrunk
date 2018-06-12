import { BaseEntity } from '../../_lib';
import { SellerId, PostId, PersonName, Day } from '../../commonTypes';
import { Appointment } from './Appointment';
import { Appointments } from './Appointments';

export class Seller extends BaseEntity {
  constructor({
    sellerId = new SellerId(),
    lastName,
    firstName,
    middleName,
    phone,
  }) {
    super(sellerId);
    this.personName = new PersonName({
      lastName,
      firstName,
      middleName,
    });
    this.phone = phone;
    this._appointments = new Appointments();
  }

  get fullName() {
    return this.personName.fullName;
  }

  get lastName() {
    return this.personName.lastName;
  }

  get firstName() {
    return this.personName.firstName;
  }

  get middleName() {
    return this.personName.middleName;
  }

  get appointments() {
    return this._appointments.appointments;
  }

  get postId() {
    return this._appointments.postId;
  }

  get postIds() {
    return this._appointments.postIds;
  }

  get recruitDay() {
    return this._appointments.recruitDay;
  }

  get isRecruited() {
    return this._appointments.isRecruited;
  }

  get quitDay() {
    return this._appointments.quitDay;
  }

  get isQuited() {
    return this._appointments.isQuited;
  }

  get seniority() {
    return this.getSeniorityAt();
  }

  update({ lastName, firstName, middleName, phone }) {
    const newPersonName = new PersonName({
      ...this.personName,
      lastName,
      firstName,
      middleName,
    });

    if (this.personName.equals(newPersonName) && this.phone === phone) {
      throw this.errors.sellerNothingToUpdate();
    }

    this.personName = newPersonName;
    if (phone) {
      this.phone = phone;
    }
  }

  getAppointmentsAt(day = new Day()) {
    return this._appointments.getAppointmentsAt(day);
  }

  addAppointment(postId, day) {
    const appointment = new Appointment({ postId, day });
    const { done, error } = this._appointments.addAppointment(appointment);

    if (!done) {
      throw error;
    }
  }

  deleteAppointment(postId, day) {
    const appointment = new Appointment({ postId, day });
    const { done, error } = this._appointments.deleteAppointment(appointment);

    if (!done) {
      throw error;
    }
  }

  editAppointment(postId, day, newPostId, newDay) {
    const appointment = new Appointment({ postId, day });
    const newAppointment = new Appointment({ postId: newPostId, day: newDay });
    const { done, error } = this._appointments.editAppointment(appointment);

    if (!done) {
      throw error;
    }
  }

  takeQuit(day = new Day()) {
    const { done, error } = this._appointments.takeQuitAt(day);

    if (!done) {
      throw error;
    }
  }

  setAppointments(appointments) {
    const { done, error } = this._appointments.setAppointments(
      appointments.map(
        ({ postId, day }) =>
          new Appointment({
            postId,
            day,
          })
      )
    );

    if (!done) {
      throw error;
    }
  }

  getPostIdAt(day = new Day()) {
    return this._appointments.getPostIdAt(day);
  }

  getPostIdsAt(day = new Day()) {
    return this._appointments.getPostIdsAt(day);
  }

  getRecruitDayAt(day = new Day()) {
    return this._appointments.getRecruitDayAt(day);
  }

  isRecruitedAt(day = new Day()) {
    return this._appointments.isRecruitedAt(day);
  }

  getQuitDayAt(day = new Day()) {
    return this._appointments.getQuitDayAt(day);
  }

  isQuitedAt(day = new Day()) {
    return this._appointments.isQuitedAt(day);
  }

  getSeniorityAt(day = new Day()) {
    if (!this.isRecruitedAt(day)) {
      return;
    }

    return day.differenceInMonths(this.getRecruitDayAt(day));
  }

  toJSON() {
    return {
      sellerId: this.sellerId.toJSON(),
      fullName: this.fullName,
      lastName: this.lastName,
      firstName: this.firstName,
      middleName: this.middleName,
      phone: this.phone,
      postId: this.postId,
      postIds: this.postIds,
      recruitDay: this.recruitDay,
      isRecruited: this.isRecruited,
      quitDay: this.quitDay,
      isQuited: this.isQuited,
      seniority: this.seniority,
      appointments: this.appointments,
    };
  }
}
