const SellerConnection = (ctx) => {
  const {
    utils: { getTypeConnection },
    types: { Seller },
  } = ctx;

  return getTypeConnection(Seller);
};
export default SellerConnection;
