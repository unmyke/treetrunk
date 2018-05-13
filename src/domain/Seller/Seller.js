import { BaseEntity } from '../_lib/BaseClasses';
import { PersonName, Day } from '../_lib/ValueObjects';
import { addErrorDefinitionProperty } from 'src/infra/support/addErrorDefinition';

import { Appointment } from './Appointment';
import { SellerId } from './SellerId';
import { PostId } from './PostId';

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

  get recruitDay() {
    return this.getRecruitDayAt();
  }

  get quitDay() {
    return this.getQuitDayAt();
  }

  get postIds() {
    return new Array(
      ...new Set(
        this.appointments
          .sort(this._appointmentsComparator)
          .map(({ postId }) => postId)
      )
    );
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
    const appointments = this.getAppointmentsAt(day);
    if (appointments.length === 0) {
      return;
    }

    return appointments[0].day;
  }

  getQuitDayAt(day = new Day()) {
    const appointments = this.appointments
      .filter(({ day: currentDay }) => currentDay <= day)
      .sort(this._appointmentsComparator);

    if (appointments.length === 0) {
      return;
    }

    const lastAppointment = appointments[appointments.length - 1];

    return lastAppointment.postId.equals(PostId.quitPostId)
      ? lastAppointment.day
      : undefined;
  }

  getLastQuitDayAt(day = new Day()) {
    return this.getPostIdLastDayAt(PostId.quitPostId, day);
  }

  getAppointmentsAt(day = new Day()) {
    const appointmentsBeforeDay = this.appointments.filter(
      ({ day: currentDay }) => currentDay <= day
    );

    if (appointmentsBeforeDay.length === 0 || this.getQuitDayAt(day)) {
      return [];
    }

    const lastQuitDay = this.getLastQuitDayAt(day);

    if (lastQuitDay == undefined) {
      return appointmentsBeforeDay;
    }

    return appointmentsBeforeDay.filter(
      ({ day: currentDay }) => currentDay > lastQuitDay
    );
  }

  getPostIdLastDayAt(postId, day = new Day()) {
    if (
      postId === undefined ||
      postId.constructor !== PostId ||
      this.appointments.length === 0
    ) {
      return;
    }

    const appointment = this.appointments
      .filter(({ day: currentDay }) => currentDay <= day)
      .sort(this._appointmentsComparator)
      .reduce((currentAppointment, appointment) => {
        return appointment.postId.equals(postId)
          ? appointment
          : currentAppointment;
      }, undefined);

    return appointment === undefined ? undefined : appointment.day;
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

  isQuitedAt(day = new Day()) {
    const quitDay = this.getQuitDayAt(day);
    return !!quitDay && quitDay <= day;
  }

  isRecruitedAt(day = new Day()) {
    const recruitDay = this.getRecruitDayAt(day);
    return !!recruitDay && recruitDay <= day;
  }

  isQuitedAt(day = new Day()) {
    const quitDay = this.getQuitDayAt(day);
    return !!quitDay && quitDay <= day;
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

addErrorDefinitionProperty(
  Seller,
  'errorDuplication',
  'OperationError',
  'Seller already have this post'
);
addErrorDefinitionProperty(
  Seller,
  'errorNoAppointments',
  'OperationError',
  'Seller have not such appointment to this postId'
);
addErrorDefinitionProperty(
  Seller,
  'errorTakeQuit',
  'OperationError',
  'Seller cannot take quit before get recruit or on the same day'
);
