import { Operation } from '../_lib/Operation';

export class CreateSeller extends Operation {
  async execute({
    lastName,
    firstName,
    middleName,
    phone,
    postId: postIdValue,
    appointDate,
  }) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;
    const {
      repositories: { Seller: sellerRepo },
      entities: { Seller },
      commonTypes: { PostId },
    } = this;

    try {
      const seller = new Seller({ lastName, firstName, middleName, phone });
      const postId = new PostId({ value: postIdValue });
      seller.appointToPostId(postIdObj, appointDate);

      const newSeller = await sallerRepo.add(seller);

      this.emit(SUCCESS, newSeller);
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

CreateSeller.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);
