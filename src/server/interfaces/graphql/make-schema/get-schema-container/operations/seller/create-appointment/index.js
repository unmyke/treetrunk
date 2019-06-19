import getArgs from './args';
import resolve from './resolver';

const createAppointment = (ctx) => {
  const {
    types: { Seller },
    utils: { getMutation },
  } = ctx;
  const args = getArgs(ctx);

  return getMutation('createSellerAppointment', {
    type: Seller,
    description: 'Add appointment to seller',
    args,
    resolve,
  });
};
export default createAppointment;
