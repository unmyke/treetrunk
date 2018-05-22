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
    return this.getSeniorityAt();
  }

  getAppointmentsAt(day = new Day()) {
    const allAppointments = this._getPostIdAppointmentsAt(day);

    const quitDay = this.getQuitDayAt(day);
    if (quitDay === undefined) {
      return allAppointments;
    }
    return allAppointments.filter(
      ({ postId: currentPostId, day: currentDay }) =>
        currentDay > quitDay && !currentDay.isQuitPostId
    );
  }

  addAppointment(postId, day) {
    const previousPostId = this.getPostIdAt(day);

    if (previousPostId === postId) {
      throw this.constructor.errorFactory.createNotAllowed(
        this,
        `Seller already appoint to post with postId ${postId} at ${day.format(
          'DD.MM.YYYY'
        )}`
      );
    }

    const appointment = new Appointment({ postId, day });
    this._appointments = [...this._appointments, appointment];
  }

  editAppointment(postIdToEdit, dayToEdit, postId, day) {
    if (postIdToEdit.equals(postId) && dayToEdit.equals(day)) {
      this.constructor.errorFactory.createNothingToUpdate(
        this,
        `Updated appoint at ${day.format('DD.MM.YYYY')} for Seller "${
          this.fullName
        }" already equlas ${postId}`
      );
    }
    this.deleteAppointment(postIdToEdit, dayToEdit);
    this.addAppointment(postId, day);
  }

  deleteAppointment(postId, day) {
    const appointmentToDelete = new Appointment({ postId, day });
    const filteredAppointments = this._appointments.filter(
      (appointment) => !appointment.equals(appointmentToDelete)
    );
    if (this._appointments.length === filteredAppointments.length) {
      throw this.constructor.errorFactory.createNotFound(
        this,
        `Appointment with postId ${postId} at ${day.format(
          'DD.MM.YYYY'
        )} not found`
      );
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
      ({ postId, day }) =>
        new Appointment({
          postId,
          day,
        })
    );
  }

  getPostIdAt(day = new Day()) {
    if (!this.isRecruitedAt(day)) {
      return;
    }

    const appointments = this.getAppointmentsAt(day);
    return appointments[appointments.length - 1].postId;
  }

  getPostIdsAt(day = new Day()) {
    return this.getAppointmentsAt(day).map(({ postId }) => postId);
  }

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
    // console.log(`день приема - ${this.getRecruitDayAt(day)}`);
    return !!recruitDay && recruitDay <= day;
  }

  getQuitDayAt(day = new Day()) {
    const quitPostIdAppointments = this._getPostIdAppointmentsAt(
      day,
      PostId.quitPostId
    );

    const lastQuitDay =
      quitPostIdAppointments.length > 0
        ? quitPostIdAppointments[quitPostIdAppointments.length - 1].day
        : undefined;

    return lastQuitDay;
  }

  isQuitedAt(day = new Day()) {
    const quitDay = this.getQuitDayAt(day);
    return !!quitDay && quitDay <= day;
  }

  getSeniorityAt(day = new Day()) {
    if (!this.isRecruitedAt(day)) {
      return;
    }

    return day.differenceInMonths(this.getRecruitDayAt(day));
  }

  // private
  _appointmentsComparator(a, b) {
    return a.day > b.day;
  }

  _getPostIdAppointmentsAt(day = new Day(), postId) {
    // const quitDay = this.getQuitDayAt(day);
    // const now = new Day();
    const recruitDay = this.getRecruitDayAt(day);
    // console.log(
    //   `нанят ? ${this.isRecruitedAt(
    //     day
    //   )}, сейчас - ${now}, день приема -${recruitDay}`
    // );
    // if (!this.isRecruitedAt(day)) {
    //   return [];
    // }
    // if (!postId) {
    //   const currentAppointments = this._appointments
    //     .filter(
    //       ({ day: currentDay }) => (quitDay || now) >= currentDay <= recruitDay
    //     )
    //     .sort(this._appointmentsComparator);
    //   return currentAppointments;
    // }
    // const postIdAppointments = this._appointments
    //   .filter(
    //     ({ day: currentDay, postId: currentPostId }) =>
    //       currentDay <= this.getRecruitDayAt(day) &&
    //       currentPostId.equals(postId)
    //   )
    //   .sort(this._appointmentsComparator);
    // //console.log(postIdAppointments);

    const postIdAppointments = this._appointments
      .sort(this._appointmentsComparator)
      .filter(({ postId: currentPostId, day: currentDay }) => {
        return (
          (!postId || currentPostId.equals(postId)) &&
          (!recruitDay || currentDay >= recruitDay) &&
          currentDay <= day
        );
      });
    return postIdAppointments;
  }
}
