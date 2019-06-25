import getArgs from './args';
import resolve from './resolver';

const deleteAppointment = (ctx) => {
  const {
    types: { Seller },
    utils: { getSchemaItem },
  } = ctx;

  const args = getSchemaItem(getArgs);

  return {
    name: 'deleteAppointmentAt',
    type: Seller,
    description: "Delete seller's appointment at day",
    args,
    resolve,
  };
};
export default deleteAppointment;
