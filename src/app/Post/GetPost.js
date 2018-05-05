import { Operation } from '../_lib/Operation';

export class GetPost extends Operation {
  async execute(postIdValue) {
    const { SUCCESS, ERROR, NOT_FOUND } = this.outputs;
    const {
      commonTypes: { PostId },
      repositories: { Post: postRepo },
    } = this;

    try {
      const postId = new PostId({ value: postIdValue });
      const post = await postRepo.getById(postId);
      console.log(post);
      const postDTO = {
        postId: postIdValue,
        name: post.name,
      };

      const pieceRatesDTO = post.pieceRates.map(async ({ value, day }) => {
        const { name: postName } = await postRepo.getById(value.value);
        return {
          value,
          date: day.value,
        };
      });
      postDTO.pieceRates = pieceRatesDTO;

      this.emit(SUCCESS, postDTO);
    } catch (error) {
      if (error.message === 'NOT_FOUND') {
        return this.emit(NOT_FOUND, error);
      }

      this.emit(ERROR, error);
    }
  }
}

GetPost.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);
