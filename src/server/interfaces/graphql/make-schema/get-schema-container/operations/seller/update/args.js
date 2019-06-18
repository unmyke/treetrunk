import { Seller as getSellerInput } from '../inputs';

const updateArgs = (ctx) => {
  const {
    utils: { getOperationArgs },
  } = ctx;
  const SellerInput = getSellerInput(ctx);

  return getOperationArgs('UpdateSellerInput', (t) => {
    t.id('id', { required: true });
    t.field('seller', { type: SellerInput, required: true });
  });
};
export default updateArgs;
