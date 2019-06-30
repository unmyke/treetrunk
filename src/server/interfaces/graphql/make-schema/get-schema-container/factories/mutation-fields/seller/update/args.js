import { Seller as getSellerInput } from '../inputs';

const updateSellerArgs = (ctx) => {
  const {
    utils: { getOperationArgs, getSchemaItem },
  } = ctx;
  const SellerInput = getSchemaItem(getSellerInput);

  return getOperationArgs('UpdateSellerInput', (t) => {
    t.id('id', { required: true });
    t.field('seller', { type: SellerInput, required: true });
  });
};
export default updateSellerArgs;
