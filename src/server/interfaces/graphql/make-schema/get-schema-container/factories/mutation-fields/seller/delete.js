const deleteSeller = (ctx) => {
  const {
    types: { Seller },
    utils: { getDeleteTypeMutationField },
  } = ctx;

  return getDeleteTypeMutationField(Seller);
};
export default deleteSeller;
