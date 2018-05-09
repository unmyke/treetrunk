import { Operation } from '../_lib/Operation';
import { postToDTO } from './postToDTO';

export class UpdatePost extends Operation {
  async execute(postIdValue, { name }) {
    const { SUCCESS, NOT_FOUND, VALIDATION_ERROR, ERROR } = this.outputs;

    const {
      repositories: { Post: postRepo },
      entities: { Post },
      commonTypes: { PostId },
      validate,
    } = this;

    try {
      const postId = new PostId({ value: postIdValue });
      const post = await postRepo.getById(postId);

      post.update({ name });

      const errors = validate(post);

      if (errors) {
        const error = new Error('ValidationError');
        error.details = errors;

        throw error;
      }

      const updatedPost = await postRepo.save(post);

      this.emit(SUCCESS, postToDTO(updatedPost));
    } catch (error) {
      switch (error.message) {
        case 'ValidationError':
          return this.emit(VALIDATION_ERROR, error);
        case 'NotFoundError':
          return this.emit(NOT_FOUND, error);
        default:
          this.emit(ERROR, error);
      }
    }
  }
}

UpdatePost.setOutputs(['SUCCESS', 'NOT_FOUND', 'VALIDATION_ERROR', 'ERROR']);
