import { BaseEntity } from '../lib/BaseClasses';
import { Contact } from '../lib/ValueObjects';
import { Appointment } from './Appointment';
import { SellerId } from './SellerId';
import { convertDate } from 'src/infra/support/dateHelpers';

export class Seller extends BaseEntity {
  constructor({ id = new SellerId(), personName, contacts = [], appointments = [] }) {
    super(id);
    this.personName = personName;
    this.contacts = contacts;
    this.appointments = appointments;
  }

  get fullName() {
    return this.personName.fullName();
  }

  addContact(type, value) {
    this.contacts = [ ...this.contacts, new Contact({ type, value }) ];
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
}
