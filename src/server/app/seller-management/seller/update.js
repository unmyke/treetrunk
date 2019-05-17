const Update = ({
  repositories: { Seller: sellerRepo },
  commonTypes: { SellerId },
}) => ({ sellerIdValue, seller: { firstName, middleName, lastName, phone } }) =>
  sellerRepo.getById(new SellerId({ value: sellerIdValue })).then((seller) => {
    seller.update({ firstName, middleName, lastName, phone });

    return sellerRepo.save(seller);
  });

export default Update;
