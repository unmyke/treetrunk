import { Operation } from '../../_lib';

export class UpdatePostPieceRate extends Operation {
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
    pieceRate: {
      percentageMetricObject: true,
    },
    updatedPieceRate: {
      percentageMetricObject: true,
    },
  };

  async execute({ postIdValue, pieceRate, updatedPieceRate }) {
    const {
      SUCCESS,
      VALIDATION_ERROR,
      NOT_FOUND,
      NOTHING_TO_UPDATE,
      ERROR,
    } = this.outputs;
    const {
      repositories: { Post: postRepo },
      commonTypes: { PostId, Day },
    } = this;

    try {
      this.validate(
        { postIdValue, pieceRate, updatedPieceRate },
        { exception: true }
      );

      const postId = new PostId({ value: postIdValue });
      const post = await postRepo.getById(postId);

      const day = new Day({ value: new Date(pieceRate.date) });
      const updatedDay = new Day({ value: new Date(updatedPieceRate.date) });

      post.editPieceRate(
        parseFloat(pieceRate.value),
        day,
        parseFloat(updatedPieceRate.value),
        updatedDay
      );

      const newPost = await postRepo.save(post);

      this.emit(SUCCESS, newPost.toJSON());
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

UpdatePostPieceRate.setOutputs([
  'SUCCESS',
  'NOT_FOUND',
  'VALIDATION_ERROR',
  'NOTHING_TO_UPDATE',
  'ERROR',
]);
