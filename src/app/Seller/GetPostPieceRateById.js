import { Operation } from '../lib/Operation';

export class GetPostPieceRateById extends Operation {
  async execute({ sellerId, date }) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;
    const { Seller: sellerRepo, Post: postRepo } = this.repositories;

    try {
      const seller = await sellerRepo.getById(sellerId);
      const postId = seller.getPostIdAt(date);
      const post = await postRepo.getById(postId);
      const { value } = post.getPieceRateAt(date);

      this.emit(SUCCESS, value);
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

GetPostPieceRateById.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);
