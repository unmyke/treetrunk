import { BaseEntity } from "../lib/BaseClasses";
import { PersonName } from "../lib/ValueObjects";
import { Appointment } from "./Appointment";
import { SellerId } from "./SellerId";
import { convertDate } from "src/infra/support/dateHelpers";
import { differenceInMonths } from "date-fns";

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

  appointToPostIdAt(postId, date) {
    const previousPostId = this.getPostIdAt(date);

    if (previousPostId === postId) {
      const error = new Error("Validation Error");
      error.details = ["Seller already have this post"];
      throw error;
    }

    const appointment = new Appointment({ postId, date });
    this.appointments = [...this.appointments, appointment].sort(
      (a, b) => a.date > b.date
    );
  }

  getPostIdAt(rawDate) {
    if (!this.isRecruited()) {
      return;
    }

    if (rawDate === undefined) {
      return this.appointments[this.appointments.length - 1].postId;
    }

    const date = convertDate(rawDate);

    const [firstAppointment, ...restAppointments] = this.appointments;
    if (firstAppointment.date > date) {
      return;
    }

    const { postId } = restAppointments.reduce(
      (currentAppointment, appointment) => {
        return appointment.date <= date ? appointment : currentAppointment;
      },
      firstAppointment
    );

    return postId;
  }

  deleteAppointmentToPostIdAt(postId, date) {
    if (!this.isRecruited()) {
      return;
    }
    const appointmentToDelete = new Appointment({ postId, date });
    const filteredAppointments = this.appointments.filter(
      appointment => !appointment.equals(appointmentToDelete)
    );
    if (this.appointments.length === filteredAppointments.length) {
      return;
    }

    this.appointments = filteredAppointments;
  }

  editAppointmentAt(postIdToEdit, dateToEdit, postId, date) {
    if (!this.isRecruited()) {
      return;
    }

    this.deleteAppointmentToPostIdAt(postIdToEdit, dateToEdit);
    this.appointToPostIdAt(postId, date);
  }

  seniority(rawDate = new Date()) {
    if (!this.isRecruited(rawDate)) {
      return;
    }

    const date = convertDate(rawDate);
    return differenceInMonths(date, this.recruitedAt(rawDate));
  }

  isRecruited(rawDate = new Date()) {
    const [firstAppointment] = this.appointments;
    const date = convertDate(rawDate);

    return !!firstAppointment && firstAppointment.date <= date;
  }

  recruitedAt(rawDate) {
    if (!this.isRecruited(rawDate)) {
      return;
    }

    const [firstAppointment] = this.appointments;
    return firstAppointment.date;
  }
}
