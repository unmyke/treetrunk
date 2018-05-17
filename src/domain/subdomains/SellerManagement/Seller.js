import { BaseEntity } from '../../_lib';
import { SellerId, PostId, PersonName, Day } from '../../commonTypes';
import { Appointment } from './Appointment';

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
    this.appointments = [];
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

  get postId() {
    return this.getPostIdAt();
  }

  get recruitDay() {
    return this.getRecruitDayAt();
  }

  get quitDay() {
    return this.getQuitDayAt();
  }

  get postIds() {
    return new Array(
      ...new Set(
        this.getAppointmentsAt()
          .sort(this._appointmentsComparator)
          .map(({ postId }) => postId)
      )
    );
  }

  get appointments() {
    return this.getAppointmentsAt();
  }

  getAppointmentsAt(day = new Day()) {
    const appointmentsBeforeDay = this.appointments.filter(
      ({ day: currentDay }) => currentDay <= day
    );

    if (appointmentsBeforeDay.length === 0 || this.getQuitDayAt(day)) {
      return [];
    }

    const quitDay = this.getQuitDayAt(day);

    if (quitDay == undefined) {
      return appointmentsBeforeDay;
    }

    return appointmentsBeforeDay.filter(
      ({ day: currentDay }) => currentDay > quitDay
    );

    return this._getPostIdAppointmentsAt(day);
  }

  _getPostIdAppointmentsAt(day, postId) {
    if (!postId) {
      return [];
    }
  }

  setAppointments(appointments) {
    this.appointments = appointments.map(
      ({ postId, date }) =>
        new Appointment({
          postId: new PostId({ value: postId }),
          day: new Day({ value: new Date(date) }),
        })
    );
  }

  addAppointment(postId, day) {
    const previousPostId = this.getPostIdAt(day);

    if (previousPostId === postId) {
      throw this.constructor.errorDuplication;
    }

    const appointment = new Appointment({ postId, day });
    this.appointments = [...this.appointments, appointment];
  }

  deleteAppointment(postId, day) {
    const appointmentToDelete = new Appointment({ postId, day });
    const filteredAppointments = this.appointments.filter(
      (appointment) => !appointment.equals(appointmentToDelete)
    );
    if (this.appointments.length === filteredAppointments.length) {
      throw this.constructor.errorNoAppointments;
    }

    this.appointments = filteredAppointments;
  }

  editAppointment(postIdToEdit, dayToEdit, postId, day) {
    this.deleteAppointment(postIdToEdit, dayToEdit);
    this.addAppointment(postId, day);
  }

  getRecruitDayAt(day = new Day()) {
    const quitPostIdAppointments = this._getAppointments(day, quitPostId);
    const recruitAppointments = this.appointments;
  }

  isRecruitedAt(day = new Day()) {
    const recruitDay = this.getRecruitDayAt(day);
    return !!recruitDay && recruitDay <= day;
  }

  getQuitDayAt(day = new Day()) {
    const quitPostIdAppointments = this._getAppointments(day, quitPostId);
    const lastQuitDay =
      quitPostIdAppointments.length > 1
        ? quitPostIdAppointments[quitPostIdAppointments.length - 1].day
        : undefined;
    return lastQuitDay;
  }

  isQuitedAt(day = new Day()) {
    const quitDay = this.getQuitDayAt(day);
    return !!quitDay && quitDay <= day;
  }

  getPostIdAt(day = new Day()) {
    if (!this.isRecruitedAt(day)) {
      return;
    }

    const [firstAppointment, ...restAppointments] = this.getAppointmentsAt(
      day
    ).sort(this._appointmentsComparator);

    const { postId } = restAppointments.reduce(
      (currentAppointment, appointment) => {
        return appointment.day <= day ? appointment : currentAppointment;
      },
      firstAppointment
    );

    return postId;
  }

  seniorityAt(day = new Day()) {
    if (!this.isRecruitedAt(day)) {
      return;
    }

    return day.differenceInMonths(this.getRecruitDayAt(day));
  }

  takeQuit(day = new Day()) {
    const recruitDay = this.getRecruitDayAt(day);
    if (!recruitDay || day <= recruitDay) {
      throw this.constructor.errorTakeQuit;
    }
    this.addAppointment(PostId.quitPostId, day);
  }

  // private
  _appointmentsComparator(a, b) {
    return a.day > b.day;
  }
}
