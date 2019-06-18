import { Day as DayScalar } from '../../../scalars';
import { Appointment as getAppointmentInput } from '../inputs';

const updateAppointmentArgs = (ctx) => {
  const {
    utils: { getOperationArgs },
  } = ctx;
  const AppointmentInput = getAppointmentInput(ctx);

  return getOperationArgs('UpdateSellerAppointmentInput', (t) => {
    t.id('id', { required: true });
    t.field('day', { type: DayScalar, required: true });
    t.field('newAppointment', { type: AppointmentInput, required: true });
  });
};
export default updateAppointmentArgs;
