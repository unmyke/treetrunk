const dismiss = (
  _,
  { id, day },
  {
    dataSources: {
      services: { dismissSeller },
    },
    serializers: { Seller: sellerSerializer },
  }
) => dismissSeller(id, day).then(sellerSerializer);

export default dismiss;
