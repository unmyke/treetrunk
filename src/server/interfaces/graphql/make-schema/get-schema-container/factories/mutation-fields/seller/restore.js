const restoreSeller = (ctx) => {
  const {
    types: { Seller },
    utils: { getRestoreTypeMutationField },
  } = ctx;

  return getRestoreTypeMutationField(Seller);
};
export default restoreSeller;
