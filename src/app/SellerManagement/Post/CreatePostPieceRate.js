import { Operation } from '../../_lib';
import { postToDTO } from './postToDTO';

export class CreatePostPieceRate extends Operation {
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
    value: {
      presence: {
        allowEmpty: false,
      },
      numericality: true,
    },
    date: {
      presence: {
        allowEmpty: false,
      },
      dateValue: true,
    },
  };

  async execute({ postIdValue, value, date }) {
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
      commonTypes: { PostId, Day },
    } = this;

    try {
      this.validate({ postIdValue, value, date });

      const postId = new PostId({ value: postIdValue });
      const post = await postRepo.getById(postId);
      const day = new Day({ value: new Date(date) });

      post.addPieceRate(value, day);

      const newPost = await postRepo.save(post);

      this.emit(SUCCESS, postToDTO(newPost));
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

CreatePostPieceRate.setOutputs([
  'SUCCESS',
  'NOT_FOUND',
  'ALREADY_EXISTS',
  'VALIDATION_ERROR',
  'NOTHING_TO_UPDATE',
  'ERROR',
]);
