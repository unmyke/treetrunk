const CreateAppointment = ({
  repositories: { Seller: sellerRepo },
  commonTypes: { PostId, SellerId, Day },
}) => (sellerIdValue, { postId: postIdValue, day: appointDate }) =>
  sellerRepo.getById(new SellerId({ value: sellerIdValue })).then((seller) => {
    seller.addAppointment(
      new PostId({ value: postIdValue }),
      new Day({ value: appointDate })
    );

    return sellerRepo.save(seller);
  });

export default CreateAppointment;
