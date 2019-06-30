import getArgs from './args';
import resolve from './resolver';

const deletePieceRate = (ctx) => {
  const {
    types: { Post },
    utils: { getSchemaItem, getMutationField },
  } = ctx;
  const args = getSchemaItem(getArgs);

  return getMutationField(
    {
      name: 'deletePieceRateAt',
      type: Post,
      description: "Delete post's pieceRate at day",
      args,
      resolve,
    },
    Post
  );
};
export default deletePieceRate;
