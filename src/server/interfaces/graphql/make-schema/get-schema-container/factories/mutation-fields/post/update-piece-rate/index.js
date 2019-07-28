import getArgs from './args';
import resolve from './resolver';

const updatePieceRate = (ctx) => {
  const {
    types: { Post },
    utils: { getSchemaItem, getMutationField },
  } = ctx;
  const args = getSchemaItem(getArgs);

  return getMutationField(
    {
      name: 'updatePieceRateTo',
      type: Post,
      description: "Update post's pieceRate at day to new value and day",
      args,
      resolve,
    },
    Post
  );
};
export default updatePieceRate;
