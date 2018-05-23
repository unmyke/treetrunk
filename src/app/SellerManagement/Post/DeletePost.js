import { Operation } from '../../_lib';

export class DeletePost extends Operation {
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
    const { SUCCESS, NOT_FOUND, NOT_ALLOWED, ERROR } = this.outputs;

    const {
      repositories: { Post: postRepo, Seller: sellerRepo },
      commonTypes: { PostId },
      validate,
    } = this;

    try {
      validate({ postIdValue }, { exception: true });

      const postId = new PostId({ value: postIdValue });

      const sellersCountWithPostId = await sellerRepo.countByPostId(postId);

      if (sellersCountWithPostId > 0) {
        const post = await postRepo.getById(postId);

        throw this.errorFactory.createNotAllowed(
          post,
          `There are sellers appointed to post "${post.name}"`
        );
      }

      await postRepo.remove(postId);

      this.emit(SUCCESS);
    } catch (error) {
      switch (error.code) {
        case 'NOT_FOUND':
          return this.emit(NOT_FOUND, error);
        case 'NOT_ALLOWED':
          return this.emit(NOT_ALLOWED, error);
        default:
          this.emit(ERROR, error);
      }
    }
  }
}

DeletePost.setOutputs(['SUCCESS', 'NOT_FOUND', 'NOT_ALLOWED', 'ERROR']);
