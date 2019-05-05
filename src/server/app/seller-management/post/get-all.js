import Operation from '../../operation';
import { Post as states } from '../../../domain/states';

export default class GetAllPosts extends Operation {
  static constraints = {
    states: { inclusion: states },
    search: {
      notEmpty: true,
    },
  };

  async execute(query = {}) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;
    const {
      repositories: { Post: postRepo },
      validate,
    } = this;

    try {
      validate(query);

      const posts = await postRepo.find(query);

      return this.emit(SUCCESS, posts);
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      return this.emit(ERROR, error);
    }
  }
}

GetAllPosts.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);
