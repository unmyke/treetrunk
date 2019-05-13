const DeleteDismiss = ({
  repositories: { Seller: sellerRepo },
  commonTypes: { SellerId },
}) => (sellerIdValue) =>
  sellerRepo.getById(new SellerId({ value: sellerIdValue })).then((seller) => {
    seller.deleteDismiss();

    return sellerRepo.save(seller);
  });

export default DeleteDismiss;
