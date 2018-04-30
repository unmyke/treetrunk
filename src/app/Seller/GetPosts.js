import { Operation } from '../_lib/Operation';

export class GetPosts extends Operation {
  async execute(props = {}) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;
    const {
      repositories: { Post: postRepo },
      domainServices: { Seller: postManagementService },
    } = this;

    try {
      const posts = await postRepo.getAll(props);
      const postsDTO = posts.map((post) => {
        const {
          postId: { value: postId },
          name,
          currentPieceRate,
        } = post;

        const postDTO = {
          postId,
          name,
          currentPieceRate,
        };

        return postDTO;
      });

      this.emit(SUCCESS, postsDTO);
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

GetPosts.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);
