import { Operation } from '../../_lib';

export class UpdatePost extends Operation {
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
    name: {
      presence: {
        allowEmpty: false,
      },
    },
  };

  async execute({ postIdValue, name }) {
    const {
      SUCCESS,
      VALIDATION_ERROR,
      NOT_FOUND,
      ALREADY_EXISTS,
      NOTHING_TO_UPDATE,
      ERROR,
    } = this.outputs;

    const {
      repositories: { Post: postRepo },
      commonTypes: { PostId },
      validate,
    } = this;

    try {
      validate({ postIdValue, name }, { exception: true });

      const postId = new PostId({ value: postIdValue });
      const post = await postRepo.getById(postId);

      post.update({ name });

      const updatedPost = await postRepo.save(post);

      this.emit(SUCCESS, updatedPost.toJSON());
    } catch (error) {
      switch (error.code) {
        case 'INVALID_VALUE':
          return this.emit(VALIDATION_ERROR, error);
        case 'NOT_FOUND':
          return this.emit(NOT_FOUND, error);
        case 'ALREADY_EXISTS':
          return this.emit(ALREADY_EXISTS, error);
        case 'NOTHING_TO_UPDATE':
          return this.emit(NOTHING_TO_UPDATE, error);
        default:
          this.emit(ERROR, error);
      }
    }
  }
}

UpdatePost.setOutputs([
  'SUCCESS',
  'VALIDATION_ERROR',
  'NOT_FOUND',
  'ALREADY_EXISTS',
  'NOTHING_TO_UPDATE',
  'ERROR',
]);
