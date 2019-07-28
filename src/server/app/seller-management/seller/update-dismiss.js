const UpdateDismiss = ({
  repositories: { Seller: sellerRepo },
  commonTypes: { SellerId, Day },
}) => (sellerIdValue, date) =>
  sellerRepo.getById(new SellerId({ value: sellerIdValue })).then((seller) => {
    seller.updateDismissTo(new Day({ value: date }));

    return sellerRepo.save(seller);
  });

export default UpdateDismiss;
