const updateDismiss = (
  _,
  { id, day: newDismissDay },
  {
    dataSources: {
      services: { updateSellerDismiss },
    },
    serializers: { Seller: sellerSerializer },
  }
) => updateSellerDismiss(id, newDismissDay).then(sellerSerializer);

export default updateDismiss;
