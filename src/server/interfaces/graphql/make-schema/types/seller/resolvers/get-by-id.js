const getId = (
  _,
  { id },
  {
    dataSources: {
      services: { getSeller },
    },
    serializers: { Seller: sellerSerializer },
  }
) => getSeller(id).then(sellerSerializer);

export default getId;
