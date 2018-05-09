import { Operation } from '../_lib/Operation';
import { postToDTO } from './postToDTO';

export class GetAllPosts extends Operation {
  async execute(props = {}) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;
    const {
      repositories: { Post: postRepo },
      domainServices: { Seller: postManagementService },
    } = this;

    try {
      const posts = await postRepo.getAll(props);
      this.emit(SUCCESS, posts.map((post) => postToDTO(post)));
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

GetAllPosts.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);
