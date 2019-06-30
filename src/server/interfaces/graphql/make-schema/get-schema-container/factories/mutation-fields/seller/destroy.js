const destroySeller = (ctx) => {
  const {
    types: { Seller },
    utils: { getDestroyTypeMutationField },
  } = ctx;

  return getDestroyTypeMutationField(Seller);
};
export default destroySeller;
