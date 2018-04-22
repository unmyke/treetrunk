import { BaseEntity } from '../_lib/BaseClasses';
import { PersonName, Day } from '../_lib/ValueObjects';
import { Appointment } from './Appointment';
import { SellerId } from './SellerId';

export class Seller extends BaseEntity {
  constructor({
    sellerId = new SellerId(),
    surname,
    firstName,
    middleName,
    phone
  }) {
    super(sellerId);
    this.personName = new PersonName({ surname, firstName, middleName });
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

  appointToPostIdAt(postId, day) {
    const previousPostId = this.getPostIdAt(day);

    if (previousPostId === postId) {
      const error = new Error('Validation Error');
      error.details = ['Seller already have this post'];
      throw error;
    }

    const appointment = new Appointment({ postId, day });
    this.appointments = [...this.appointments, appointment].sort(
      (a, b) => a.day > b.day
    );
  }

  getPostIdAt(day) {
    if (!this.isRecruited()) {
      return;
    }

    if (day === undefined) {
      return this.appointments[this.appointments.length - 1].postId;
    }

    const [firstAppointment, ...restAppointments] = this.appointments;
    if (firstAppointment.day > day) {
      return;
    }

    const { postId } = restAppointments.reduce(
      (currentAppointment, appointment) => {
        return appointment.day <= day ? appointment : currentAppointment;
      },
      firstAppointment
    );

    return postId;
  }

  deleteAppointmentToPostIdAt(postId, day) {
    if (!this.isRecruited()) {
      return;
    }
    const appointmentToDelete = new Appointment({ postId, day });
    const filteredAppointments = this.appointments.filter(
      appointment => !appointment.equals(appointmentToDelete)
    );
    if (this.appointments.length === filteredAppointments.length) {
      return;
    }

    this.appointments = filteredAppointments;
  }

  editAppointmentAt(postIdToEdit, dayToEdit, postId, day) {
    if (!this.isRecruited()) {
      return;
    }

    this.deleteAppointmentToPostIdAt(postIdToEdit, dayToEdit);
    this.appointToPostIdAt(postId, day);
  }

  seniority(day = new Day()) {
    if (!this.isRecruited(day)) {
      return;
    }

    return day.differenceInMonths(this.recruitedAt(day));
  }

  isRecruited(day = new Day()) {
    const [firstAppointment] = this.appointments;
    return !!firstAppointment && firstAppointment.day <= day;
  }

  recruitedAt(day) {
    if (!this.isRecruited(day)) {
      return;
    }

    const [firstAppointment] = this.appointments;
    return firstAppointment.day;
  }
}
