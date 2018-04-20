import { Operation } from '../lib/Operation';

export class AddSellerAppointment extends Operation {
  async execute({ sellerId, postId, appointDate }) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;
    const { repositories: { Seller: repo }, domain: { commonTypes: { PostId } } } = this;

    const seller = repo.getById(sellerId);
    const postIdObj = new PostId({ id: postId });
    seller.appointToPostId(postIdObj, appointDate);

    try {
      const newSeller = await repo.update(seller);

      this.emit(SUCCESS, newSeller);
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

AddSellerAppointment.setOutputs([ 'SUCCESS', 'ERROR', 'VALIDATION_ERROR' ]);