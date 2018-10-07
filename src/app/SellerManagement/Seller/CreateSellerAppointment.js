import { Operation } from '../../_lib';

export class CreateSellerAppointment extends Operation {
  async execute({
    sellerIdValue,
    appointments: { postId: postIdValue, day: appointDate },
  }) {
    const {
      SUCCESS,
      NOT_FOUND,
      ALREADY_EXISTS,
      VALIDATION_ERROR,
      ERROR,
    } = this.outputs;
    const {
      repositories: { Seller: sellerRepo },
      commonTypes: { PostId, SellerId },
    } = this;

    try {
      const sellerId = new SellerId({ value: sellerIdValue });
      const seller = await sellerRepo.getById(sellerId);

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

CreateSellerAppointment.setOutputs([
  'SUCCESS',
  'NOT_FOUND',
  'ALREADY_EXISTS',
  'VALIDATION_ERROR',
]);
