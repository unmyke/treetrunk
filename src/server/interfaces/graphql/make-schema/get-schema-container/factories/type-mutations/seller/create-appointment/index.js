import getArgs from './args';
import resolve from './resolver';

const createAppointment = (ctx) => {
  const {
    types: { Seller },
    utils: { getSchemaItem },
  } = ctx;

  const args = getSchemaItem(getArgs);

  return {
    name: 'createAppointment',
    type: Seller,
    description: 'Add appointment to seller',
    args,
    resolve,
  };
};
export default createAppointment;
