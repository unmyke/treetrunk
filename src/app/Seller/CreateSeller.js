import { Operation } from '../lib/Operation';

export class CreateSeller extends Operation {
  async execute({ surname, firstName, middleName, phone, postId, appointDate }) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;
    const { repositories: { Seller: repo }, domain: { entities: { Seller }, commonTypes: { PostId } } } = this;

    const seller = new Seller({ surname, firstName, middleName, phone });
    const postIdObj = new PostId({ id: postId });
    seller.appointToPostId(postIdObj, appointDate);

    try {
      const newSeller = await repo.add(seller);

      this.emit(SUCCESS, newSeller);
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

CreateSeller.setOutputs([ 'SUCCESS', 'ERROR', 'VALIDATION_ERROR' ]);
