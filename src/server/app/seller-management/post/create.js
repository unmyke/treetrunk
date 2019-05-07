import Operation from '../../operation';

export default class CreatePost extends Operation {
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
      validate,
      errors,
    } = this;

    try {
      validate({ name }, { exception: true });

      const post = new Post({ name });
      const newPost = await postRepo.add(post);
      this.emit(SUCCESS, newPost.toJSON());
    } catch (error) {
      switch (true) {
        case isEqualErrors(error, errors.postAlreadyExists()):
          this.emit(ALREADY_EXISTS, error);
          break;
        case isEqualErrors(error, errors.validationError()):
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
