import { Operation } from '../_lib/Operation';

export class CreatePost extends Operation {
  async execute({ name }) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;
    const {
      repositories: { Post: postRepo },
      entities: { Post },
      commonTypes: { PostId },
    } = this;

    try {
      const post = new Post({ name });

      const newPost = await postRepo.add(post);

      this.emit(SUCCESS, newPost);
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

CreatePost.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);
