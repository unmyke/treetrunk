import { SellerManagementOperation } from '../SellerManagementOperation';
import { postToDTO } from './postToDTO';

export class GetPost extends SellerManagementOperation {
  async execute(postIdValue) {
    const { SUCCESS, ERROR, NOT_FOUND } = this.outputs;
    const {
      commonTypes: { PostId },
      repositories: { Post: postRepo },
    } = this;

    try {
      const postId = new PostId({ value: postIdValue });
      const post = await postRepo.getById(postId);

      this.emit(SUCCESS, postToDTO(post));
    } catch (error) {
      if (error.code === 'NOT_FOUND') {
        return this.emit(NOT_FOUND, error);
      }

      this.emit(ERROR, error);
    }
  }
}

GetPost.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);
