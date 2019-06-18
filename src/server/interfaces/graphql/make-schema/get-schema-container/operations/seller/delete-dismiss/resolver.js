const deleteDismiss = (
  _,
  { id },
  {
    dataSources: {
      services: { deleteSellerDismiss },
    },
    serializers: { Seller: sellerSerializer },
  }
) => deleteSellerDismiss(id).then(sellerSerializer);

export default deleteDismiss;
