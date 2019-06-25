import getArgs from './args';
import resolve from './resolver';

const updateAppointment = (ctx) => {
  const {
    types: { Seller },
    utils: { getSchemaItem },
  } = ctx;

  const args = getSchemaItem(getArgs);

  return {
    name: 'updateAppointmentTo',
    type: Seller,
    description: "Update seller's appointment at day to new postId and day",
    args,
    resolve,
  };
};
export default updateAppointment;
