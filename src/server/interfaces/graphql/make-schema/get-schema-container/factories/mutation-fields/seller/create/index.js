import getArgs from './args';

const createSeller = (ctx) => {
  const {
    types: { Seller },
    utils: { getCreateTypeMutationField, getSchemaItem },
  } = ctx;
  const args = getSchemaItem(getArgs);

  return getCreateTypeMutationField(Seller, { args });
};
export default createSeller;
