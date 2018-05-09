import { Operation } from '../_lib/Operation';

export class CreatePostPieceRate extends Operation {
  async execute(postIdValue, { value, date }) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;
    const {
      repositories: { Post: postRepo },
      commonTypes: { PostId, Day },
    } = this;

    try {
      const postId = new PostId({ value: postIdValue });
      const post = await postRepo.getById(postId);

      const day = new Day({ value: new Date(date) });

      post.addPieceRate(value, day);

      const newPost = await postRepo.save(post);

      this.emit(SUCCESS, newPost);
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

CreatePostPieceRate.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);
