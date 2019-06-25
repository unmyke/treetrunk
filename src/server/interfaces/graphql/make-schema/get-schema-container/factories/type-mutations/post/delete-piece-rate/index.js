import getArgs from './args';
import resolve from './resolver';

const deletePieceRate = (ctx) => {
  const {
    types: { Post },
    utils: { getSchemaItem },
  } = ctx;
  const args = getSchemaItem(getArgs);

  return {
    name: 'deletePieceRateAt',
    type: Post,
    description: "Delete post's pieceRate at day",
    args,
    resolve,
  };
};
export default deletePieceRate;