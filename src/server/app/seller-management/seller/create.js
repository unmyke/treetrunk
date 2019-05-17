const Create = ({
  entities: { Selller },
  repositories: { Seller: sellerRepo },
  commonTypes: { PostId, Day },
}) => ({ seller: { firstName, middleName, lastName, phone }, appointment }) => {
  const newSeller = new Selller({ firstName, middleName, lastName, phone });

  if (appointment) {
    const { postId: postIdValue, day: appointDate } = appointmnet;
    newSeller.addAppointment(
      new PostId({ value: postIdValue }),
      new Day({ value: appointDate })
    );
  }

  return sellerRepo.save(newSeller);
};

export default Create;
