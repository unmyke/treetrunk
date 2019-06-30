import { Appointment as getAppointmentInput } from '../inputs';

const updateAppointmentArgs = (ctx) => {
  const {
    scalars: { Day },
    utils: { getOperationArgs, getSchemaItem },
  } = ctx;
  const AppointmentInput = getSchemaItem(getAppointmentInput);

  return getOperationArgs('UpdateSellerAppointmentInput', (t) => {
    t.id('id', { required: true });
    t.field('day', { type: Day, required: true });
    t.field('newAppointment', { type: AppointmentInput, required: true });
  });
};
export default updateAppointmentArgs;
