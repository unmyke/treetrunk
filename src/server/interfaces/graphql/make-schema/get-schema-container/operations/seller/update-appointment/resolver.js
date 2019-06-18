const updateAppointment = (
  _,
  { id, day, newAppointment: { postId: newPostId, day: newDay } },
  {
    dataSources: {
      services: { updateSellerAppointment },
    },
    serializers: { Seller: sellerSerializer },
  }
) =>
  updateSellerAppointment(id, day, { postId: newPostId, day: newDay }).then(
    sellerSerializer
  );

export default updateAppointment;
