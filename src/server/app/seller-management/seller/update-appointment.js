const UpdateAppointment = ({
  repositories: { Seller: sellerRepo },
  commonTypes: { PostId, SellerId, Day },
}) => (sellerIdValue, date, { postId: postIdValue, day: newDate }) =>
  sellerRepo.getById(new SellerId({ value: sellerIdValue })).then((seller) => {
    seller.updateAppointmentTo(
      new Day({ value: date }),
      new PostId({ value: postIdValue }),
      new Day({ value: newDate })
    );

    return sellerRepo.save(seller);
  });

export default UpdateAppointment;
