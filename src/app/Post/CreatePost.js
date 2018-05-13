import { Operation } from '../_lib/Operation';

export class CreatePost extends Operation {
  static constraints = {
    name: {
      presence: {
        allowEmpty: false,
      },
    },
  };

  async execute({ name }) {
    const { SUCCESS, ERROR, VALIDATION_ERROR, ALREADY_EXISTS } = this.outputs;
    const {
      repositories: { Post: postRepo },
      entities: { Post },
      commonTypes: { PostId },
      validate,
    } = this;

    try {
      validate({ name }, { exception: true });

      const post = new Post({ name });

      const newPost = await postRepo.add(post);

      this.emit(SUCCESS, newPost);
    } catch (error) {
      switch (error.code) {
        case 'ALREADY_EXISTS':
          this.emit(ALREADY_EXISTS, error);
          break;
        case 'INVALID_VALUE':
          this.emit(VALIDATION_ERROR, error);
          break;
        default:
          this.emit(ERROR, error);
          break;
      }
    }
  }
}

CreatePost.setOutputs([
  'SUCCESS',
  'ERROR',
  'VALIDATION_ERROR',
  'ALREADY_EXISTS',
]);
