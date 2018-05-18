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

  get seniority() {
    return this.seniorityAt();
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

  // get appointments() {
  //   return this.getAppointmentsAt().sort(this._appointmentsComparator);
  // }

  getAppointmentsAt(day = new Day()) {
    return this._getPostIdAppointmentsAt(day);
  }

  _getPostIdAppointmentsAt(day, postId) {
    if (!postId) {
      const currentAppointments = this.appointments
        .filter(({ day: currentDay }) => currentDay > this.getRecruitDayAt(day))
        .sort(this._appointmentsComparator);
      console.log(currentAppointments);
      return currentAppointments;
    }
    const postIdAppointments = this.appointments
      .filter(
        ({ day: currentDay, postId: currentPostId }) =>
          currentDay > this.getRecruitDayAt(day) && currentPostId == postId
      )
      .sort(this._appointmentsComparator);
    console.log(postIdAppointments);
    return postIdAppointments;
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
    const [firstAppointment, ...appointments] = this.appointments
      .filter(({ day: currentDay }) => {
        return currentDay <= day;
      })
      .sort(this._appointmentsComparator);
    if (firstAppointment === undefined) {
      return undefined;
    }

    return appointments.reduce(
      (recruitDay, { postId, day: currentDay }, index) => {
        return postId.isQuitPostId() ? appointments[index + 1].day : recruitDay;
      },
      firstAppointment.day
    );
  }

  isRecruitedAt(day = new Day()) {
    const recruitDay = this.getRecruitDayAt(day);
    // console.log(recruitDay);
    return !!recruitDay && recruitDay <= day;
  }

  getQuitDayAt(day = new Day()) {
    const quitPostIdAppointments = this._getPostIdAppointmentsAt(
      day,
      PostId.quitPostId
    );
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
      throw this.constructor.errorFactory.createNotAllowed(
        this,
        'Seller cannot take quit if there is no recruit day or take quit day is early or equals recruit day'
      );
    }
    this.addAppointment(PostId.quitPostId, day);
  }

  // private
  _appointmentsComparator(a, b) {
    return a.day > b.day;
  }
}
