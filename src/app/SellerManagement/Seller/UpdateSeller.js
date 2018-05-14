import { SellerManagementOperation } from '../SellerManagementOperation';

export class UpdateSeller extends SellerManagementOperation {
  async execute(sellerIdValue, { lastName, firstName, middleName, phone }) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;
    const {
      repositories: { Seller: sellerRepo },
      entities: { Seller },
      commonTypes: { SellerId },
    } = this;

    try {
      const sellerId = new SellerId({ value: sellerIdValue });
      const seller = await sellerRepo.getById(sellerId);

      seller.update({ lastName, firstName, middleName, phone });

      const updatedSeller = await sellerRepo.save(seller);

      this.emit(SUCCESS, updatedSeller);
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

UpdateSeller.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);
