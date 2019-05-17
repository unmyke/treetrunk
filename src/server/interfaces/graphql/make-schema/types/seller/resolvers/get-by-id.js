const getId = (
  _,
  { id },
  { services: { getSeller }, serializers: { Seller: sellerSerializer } }
) => getSeller(id).then(sellerSerializer);

export default getId;
