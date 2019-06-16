import { Appointment as getAppointmentInput } from '../inputs';

const createAppointmentArgs = (ctx) => {
  const {
    utils: { getOperationArgs },
  } = ctx;
  const AppointmentInput = getAppointmentInput(ctx);

  return getOperationArgs('CreateSellerAppointmentInput', (t) => {
    t.id('id', { required: true });
    t.field('appointment', { type: AppointmentInput, required: true });
  });
};
export default createAppointmentArgs;
