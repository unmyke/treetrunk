import { BaseEntity, Contact } from '../lib';
import { Appointment } from './Appointment';
import { SalerId } from './SalerId';

export class Saler extends BaseEntity {
  constructor({ id = new SalerId(), personName, contacts = [], appointments = [] }) {
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

  appointByPostId(postId, date) {
    const appointment = new Appointment({ postId, date });
    this.appointments = [ ...this.appointments, appointment ].sort((a, b) => a.date > b.date);
  }

  getPostIdAtDate(date) {
    if (this.appointments.length === 0) {
      return;
    }

    const [ firstAppointment, ...restAppointments ] = this.appointments;
    if (firstAppointment.date > date) {
      return;
    }

    const { postId } = restAppointments.reduce((currentAppointment, appointment) => {
      return appointment.date < date ? appointment : currentAppointment;
    }, firstAppointment);

    return postId;
  }
}
