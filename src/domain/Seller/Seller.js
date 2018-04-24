import { BaseEntity } from '../_lib/BaseClasses';
import { PersonName, Day } from '../_lib/ValueObjects';
import { Appointment } from './Appointment';
import { SellerId } from './SellerId';
import { makeError } from 'src/infra/support/makeError';

export class Seller extends BaseEntity {
  // Errors

  static errorDuplication = makeError(
    'OperationError',
    'Seller already have this post',
  );
  static errorNoAppointments = makeError(
    'OperationError',
    'Seller have not such appointment to this postId',
  );

  constructor({
    sellerId = new SellerId(),
    surname,
    firstName,
    middleName,
    phone,
  }) {
    super(sellerId);
    this.personName = new PersonName({
      surname,
      firstName,
      middleName,
    });
    this.phone = phone;
    this.appointments = [];
  }

  get fullName() {
    return this.personName.fullName;
  }

  get surname() {
    return this.personName.surname;
  }

  get firstName() {
    return this.personName.firstName;
  }

  get middleName() {
    return this.personName.middleName;
  }

  addAppointment(postId, day) {
    const previousPostId = this.getPostIdAt(day);

    if (previousPostId === postId) {
      throw this.constructor.errorDuplication;
    }

    const appointment = new Appointment({ postId, day });
    this.appointments = [...this.appointments, appointment].sort(
      (a, b) => a.day > b.day,
    );
  }

  deleteAppointment(postId, day) {
    const appointmentToDelete = new Appointment({ postId, day });
    const filteredAppointments = this.appointments.filter(
      (appointment) => !appointment.equals(appointmentToDelete),
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

  getPostIdAt(day = new Day()) {
    if (!this.isRecruitedAt(day)) {
      return;
    }

    const [firstAppointment, ...restAppointments] = this.appointments;

    const { postId } = restAppointments.reduce(
      (currentAppointment, appointment) => {
        return appointment.day <= day ? appointment : currentAppointment;
      },
      firstAppointment,
    );

    return postId;
  }

  seniorityAt(day = new Day()) {
    if (!this.isRecruitedAt(day)) {
      return;
    }

    return day.differenceInMonths(this.recruitDay);
  }

  isRecruitedAt(day = new Date()) {
    const recruitDay = this.recruitDay;
    return !!recruitDay && recruitDay <= day;
  }

  get recruitDay() {
    const [firstAppointment] = this.appointments;
    return firstAppointment && firstAppointment.day;
  }
}
