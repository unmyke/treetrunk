const sellerMutationField = (ctx) => {
  const {
    types: { Seller },
    utils: { getTypeMutationField },
  } = ctx;

  return getTypeMutationField(Seller);
};
export default sellerMutationField;
