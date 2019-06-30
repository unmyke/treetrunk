const sellerQueryField = (ctx) => {
  const {
    types: { Seller },
    utils: { getTypeByIdQueryField },
  } = ctx;

  return getTypeByIdQueryField(Seller);
};
export default sellerQueryField;
