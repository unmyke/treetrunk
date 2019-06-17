import updatePieceRate from './update-piece-rate';
import deletePieceRate from './delete-piece-rate';
import createPieceRate from './create-piece-rate';

const PostOperations = {
  updatePieceRate,
  deletePieceRate,
  createPieceRate,
};

const getPostOperations = (ctx) => {
  const {
    types: { Post },
    utils: { createTypeOperations },
  } = ctx;

  return createTypeOperations(Post, PostOperations);
};
export default getPostOperations;
