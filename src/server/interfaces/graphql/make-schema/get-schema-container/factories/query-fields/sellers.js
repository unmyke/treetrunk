const sellersQueryField = (ctx) => {
  const {
    types: { Seller },
    utils: { getTypeListQueryField },
  } = ctx;

  return getTypeListQueryField(Seller);
};
export default sellersQueryField;
