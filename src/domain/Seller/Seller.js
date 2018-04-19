import { BaseEntity } from '../lib/BaseClasses';
import { Contact, PersonName } from '../lib/ValueObjects';
import { Appointment } from './Appointment';
import { SellerId } from './SellerId';
import { convertDate } from 'src/infra/support/dateHelpers';

export class Seller extends BaseEntity {
  constructor({ id = new SellerId(), surname, firstName, middleName, phone, appointments = [] }) {
    super(id);
    this.personName = new PersonName({ surname, firstName, middleName });
    this.phone = phone;
    this.appointments = appointments;
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

  appointToPostId(postId, date) {
    const previousPostId = this.getPostIdAtDate(date);

    if (previousPostId === postId) {
      const error = new Error('Validation Error');
      error.details = ['Seller already have this post'];
      throw error;
    }

    const appointment = new Appointment({ postId, date });
    this.appointments = [ ...this.appointments, appointment ].sort((a, b) => a.date > b.date);
  }

  getPostIdAtDate(rawDate) {
    if (this.appointments.length === 0) {
      return;
    }

    if (rawDate === undefined) {
      return this.appointments[this.appointments.length - 1].postId;
    }

    const date = convertDate(rawDate);

    const [ firstAppointment, ...restAppointments ] = this.appointments;
    if (firstAppointment.date > date) {
      return;
    }

    const { postId } = restAppointments.reduce((currentAppointment, appointment) => {
      return appointment.date <= date ? appointment : currentAppointment;
    }, firstAppointment);

    return postId;
  }

  deleteAppointmentToPostIdAtDate(postId, date) {
    const error = new Error('Validation Error');
    error.details = ['Seller have not such appointment to this postId'];

    const appointmentToDelete = new Appointment({ postId, date });

    const filteredAppointments = this.appointments.filter(appointment => !appointment.equals(appointmentToDelete));
    if (this.appointments.length === filteredAppointments.length) {
      throw error;
    }
    
    this.appointments = filteredAppointments;
  }
}
