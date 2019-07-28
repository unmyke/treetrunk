const Dismiss = ({
  repositories: { Seller: sellerRepo },
  commonTypes: { SellerId, Day },
}) => (sellerIdValue, date) =>
  sellerRepo.getById(new SellerId({ value: sellerIdValue })).then((seller) => {
    seller.dismissAt(new Day({ value: date }));

    return sellerRepo.save(seller);
  });

export default Dismiss;
