import { idArg, arg } from 'nexus';
import { Appointment as AppointmentInput } from '../../inputs';

const addAppointmentArgs = {
  id: idArg({ required: true }),
  appointment: arg({ type: AppointmentInput, required: true }),
};
export default addAppointmentArgs;
