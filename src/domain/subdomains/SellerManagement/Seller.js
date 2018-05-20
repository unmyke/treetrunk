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
    this._appointments = [];
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
    return this.getAppointmentsAt().sort(this._appointmentsComparator);
  }

  get postId() {
    return this.getPostIdAt();
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

  get recruitDay() {
    return this.getRecruitDayAt();
  }

  get isRecruited() {
    return this.isRecruitedAt();
  }

  get quitDay() {
    return this.getQuitDayAt();
  }

  get isQuited() {
    return this.isQuitedAt();
  }

  get seniority() {
    return this.seniorityAt();
  }

  getAppointmentsAt(day = new Day()) {
    return this._getPostIdAppointmentsAt(day);
  }

  addAppointment(postId, day) {
    // const previousPostId = this.getPostIdAt(day);

    // if (previousPostId === postId) {
    //   throw this.constructor.errorDuplication;
    // }

    const appointment = new Appointment({ postId, day });
    this._appointments = [...this._appointments, appointment];
  }

  editAppointment(postIdToEdit, dayToEdit, postId, day) {
    this.deleteAppointment(postIdToEdit, dayToEdit);
    this.addAppointment(postId, day);
  }

  deleteAppointment(postId, day) {
    const appointmentToDelete = new Appointment({ postId, day });
    const filteredAppointments = this._appointments.filter(
      (appointment) => !appointment.equals(appointmentToDelete)
    );
    if (this._appointments.length === filteredAppointments.length) {
      throw this.constructor.errorNoAppointments;
    }

    this._appointments = filteredAppointments;
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

  setAppointments(appointments) {
    this._appointments = appointments.map(
      ({ postId, date }) =>
        new Appointment({
          postId: new PostId({ value: postId }),
          day: new Day({ value: new Date(date) }),
        })
    );
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

  getPostIdsAt(day = new Day()) {}

  getRecruitDayAt(day = new Day()) {
    const [firstAppointment, ...appointments] = this._appointments
      .filter(({ day: currentDay }) => {
        return currentDay <= day;
      })
      .sort(this._appointmentsComparator);
    if (firstAppointment === undefined) {
      return undefined;
    }

    return appointments.reduce(
      (recruitDay, { postId, day: currentDay }, index) => {
        if (postId.isQuitPostId()) {
          return appointments[index + 1]
            ? appointments[index + 1].day
            : undefined;
        }
        return recruitDay;
      },
      firstAppointment.day
    );
  }

  isRecruitedAt(day = new Day()) {
    const recruitDay = this.getRecruitDayAt(day);
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

  seniorityAt(day = new Day()) {
    if (!this.isRecruitedAt(day)) {
      return;
    }

    return day.differenceInMonths(this.getRecruitDayAt(day));
  }

  // private
  _appointmentsComparator(a, b) {
    return a.day > b.day;
  }

  _getPostIdAppointmentsAt(day, postId) {
    if (!postId) {
      const currentAppointments = this._appointments
        .filter(({ day: currentDay }) => currentDay > this.getRecruitDayAt(day))
        .sort(this._appointmentsComparator);
      console.log(currentAppointments);
      return currentAppointments;
    }
    const postIdAppointments = this._appointments
      .filter(
        ({ day: currentDay, postId: currentPostId }) =>
          currentDay > this.getRecruitDayAt(day) && currentPostId == postId
      )
      .sort(this._appointmentsComparator);
    console.log(postIdAppointments);
    return postIdAppointments;
  }
}
