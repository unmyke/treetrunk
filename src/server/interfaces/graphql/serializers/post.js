import timestamp from './timestamp';
import { identity } from '@common';

const postSerializer = {
  serialize: ({ postId, name, pieceRate, pieceRates, state }) => {
    const serializedPieceRates = pieceRates.map(({ value, day }) => ({
      value,
      day,
    }));

    return {
      id: postId,
      name,
      pieceRate,
      pieceRates: serializedPieceRates,
      state,
    };
  },
  parse: identity,
};

export default timestamp(postSerializer);
