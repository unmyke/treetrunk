import Operation from '../../operation';

export default class FindPosts extends Operation {
  async execute({ pagination, sort, filter }) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;
    const {
      repositories: { Post: postRepo },
    } = this;

    try {
      const posts = await postRepo.getAll({ pagination, sort, filter });
      return this.emit(SUCCESS, posts.map((post) => post.toJSON()));
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      return this.emit(ERROR, error);
    }
  }
}

FindPosts.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);
