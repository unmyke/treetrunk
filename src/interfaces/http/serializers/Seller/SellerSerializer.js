import { IdSerializer } from '../lib';
import { AppointmentSerializer } from './AppointmentSerializer';
import { PersonNameSerializer } from './PersonNameSerializer';

export const SellerSerializer = {
  serialize: ({ id, personName, phone, appointments }) => ({
    id: IdSerializer.serialize(id),
    personName: PersonNameSerializer.serialize(personName),
    phone,
    appointments: appointments.map(AppointmentSerializer.serialize),
  })
};
