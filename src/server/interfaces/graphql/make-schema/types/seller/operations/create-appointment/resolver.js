const createAppointment = (
  _,
  { id, appointment: { postId, day } },
  {
    services: { createSellerAppointment },
    serializers: { Seller: sellerSerializer },
  }
) => createSellerAppointment(id, { postId, day }).then(sellerSerializer);

export default createAppointment;
