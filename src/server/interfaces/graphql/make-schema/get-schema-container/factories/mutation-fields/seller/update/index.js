import getArgs from './args';

const updateSeller = (ctx) => {
  const {
    types: { Seller },
    utils: { getUpdateTypeMutationField, getSchemaItem },
  } = ctx;
  const args = getSchemaItem(getArgs);

  return getUpdateTypeMutationField(Seller, { args });
};
export default updateSeller;
