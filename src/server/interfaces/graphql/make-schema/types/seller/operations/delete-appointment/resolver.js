const deleteAppointment = (
  _,
  { id, day },
  {
    dataSources: {
      services: { deleteSellerAppointment },
    },
    serializers: { Seller: sellerSerializer },
  }
) => deleteSellerAppointment(id, day).then(sellerSerializer);

export default deleteAppointment;
