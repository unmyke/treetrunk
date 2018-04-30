import { Operation } from '../_lib/Operation';

export class AddSellerAppointment extends Operation {
  async execute({ sellerId: sellerIdValue, postId: postIdValue, appointDate }) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;
    const {
      repositories: { Seller: sellerRepo },
      commonTypes: { PostId, SellerId },
    } = this;

    try {
      const sellerId = new SellerId({ value: sellerIdValue });
      const seller = sellerRepo.getById(sellerId);

      const postId = new PostId({ value: postIdValue });
      seller.addAppointment(postId, appointDate);

      const newSeller = await sellerRepo.save(seller);

      this.emit(SUCCESS, newSeller);
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

AddSellerAppointment.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);
