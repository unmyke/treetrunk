import { idArg, arg } from 'nexus';
import { Day as DayScalar } from '../../../../scalars';
import { Appointment as AppointmentInput } from '../../inputs';

const updateAppointmentArgs = {
  id: idArg({ required: true }),
  day: arg({ type: DayScalar, required: true }),
  newAppointment: arg({ type: AppointmentInput, required: true }),
};
export default updateAppointmentArgs;
