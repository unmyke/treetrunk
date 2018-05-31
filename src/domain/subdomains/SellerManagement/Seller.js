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
    return this.getAppointmentsAt();
  }

  get postId() {
    return this.getPostIdAt();
  }

  get postIds() {
    return new Array(
      //...new Set(this.getAppointmentsAt().map(({ postId }) => postId))
      ...new Set(
        this.getAppointmentsAt()
          .filter((appointment) => !appointment.postId.isQuitPostId())
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

  update({ lastName, firstName, middleName, phone }) {
    const newPersonName = new PersonName({
      ...this.personName,
      lastName,
      firstName,
      middleName,
    });

    if (this.personName.equals(newPersonName) && this.phone === phone) {
      throw this.constructor.errorFactory.createNothingToUpdate(
        this,
        `Seller already has lastName "${lastName}", firstName "${firstName}", middleName "${middleName}" and phone "${phone}"`
      );
    }

    this.personName = newPersonName;
    if (phone) {
      this.phone = phone;
    }
  }

  getAppointmentsAt(day = new Day()) {
    if (!this.isRecruitedAt(day)) {
      if (this.isQuitedAt(day)) {
        return [this._getAppointmentAt(this.getQuitDayAt(day))];
      }
      return [];
    }

    const recruitDay = this.getRecruitDayAt(day);
    const currentAppointments = this._getAllAppointmentsAt(day).filter(
      ({ day: currentDay }) => currentDay >= recruitDay
    );
    return currentAppointments;
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
    const appointment = this._getAppointmentAt(day);

    if (!appointment || appointment.postId.isQuitPostId()) {
      return;
    }
    return appointment.postId;
  }

  getPostIdsAt(day = new Day()) {
    return this.getAppointmentsAt(day)
      .filter((appointment) => !appointment.postId.isQuitPostId())
      .map(({ postId }) => postId);
  }

  getRecruitDayAt(day = new Day()) {
    if (!this.isRecruitedAt(day)) {
      return;
    }

    const [firstAppointment, ...appointments] = this._getAllAppointmentsAt(day);
    return appointments.reduce((recruitDay, { postId }, index) => {
      if (postId.isQuitPostId()) {
        return appointments[index + 1].day;
      }
      return recruitDay;
    }, firstAppointment.day);
  }

  isRecruitedAt(day = new Day()) {
    return !!this.getPostIdAt(day);
  }

  getQuitDayAt(day = new Day()) {
    const appointment = this._getAppointmentAt(day);
    if (!appointment || !appointment.postId.isQuitPostId()) {
      return;
    }
    return appointment.day;
  }

  isQuitedAt(day = new Day()) {
    return !!this.getQuitDayAt(day);
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

  // private
  _getAllAppointmentsAt(day = new Day()) {
    return this._appointments
      .sort(this._dayComparator)
      .filter(({ day: currentDay }) => currentDay <= day);
  }

  _getAppointmentAt(day = new Day()) {
    const appointments = this._getAllAppointmentsAt(day);

    if (appointments.length === 0) {
      return;
    }

    return appointments[appointments.length - 1];
  }
}
