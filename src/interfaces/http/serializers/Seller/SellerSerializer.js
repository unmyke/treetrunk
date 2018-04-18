import { SellerIdSerializer } from './SellerIdSerializer';
import { AppointmentSerializer } from './AppointmentSerializer';

export const SellerSerializer = {
  serialize: ({ id, surname, firstName, middleName, appointments }) => ({
    id: SellerIdSerializer.serialize(id),
    surname,
    firstName,
    middleName,
    appointments: appointments.map(AppointmentSerializer.serialize),
  })
};