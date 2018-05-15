import { SellerManagementOperation } from '../SellerManagementOperation';
import { postToDTO } from './postToDTO';

export class DeletePost extends SellerManagementOperation {
  static constraints = {
    postIdValue: {
      presence: {
        allowEmpty: false,
      },
      format: {
        pattern: '[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}',
        message: '^PostId: "%{value}" must be UUID',
      },
    },
  };

  async execute({ postIdValue }) {
    const { SUCCESS, NOT_FOUND, ERROR } = this.outputs;

    const {
      repositories: { Post: postRepo },
      commonTypes: { PostId },
      validate,
    } = this;

    try {
      validate({ postIdValue }, { exception: true });

      const postId = new PostId({ value: postIdValue });

      await postRepo.remove(postId);

      this.emit(SUCCESS);
    } catch (error) {
      switch (error.code) {
        case 'NOT_FOUND':
          return this.emit(NOT_FOUND, error);
        default:
          this.emit(ERROR, error);
      }
    }
  }
}

DeletePost.setOutputs(['SUCCESS', 'NOT_FOUND', 'ERROR']);
