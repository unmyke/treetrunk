import id from './id';
import day from './day';
import timestamp from './timestamp';

const serializers = { id, day };

const postSerializer = ({ postId, name, pieceRate, pieceRates, state }) => {
  const serializedPieceRates = pieceRates.map(({ value, day }) => ({
    value,
    day: serializers.day(day),
  }));

  return {
    id: serializers.id(postId),
    name,
    pieceRate,
    pieceRates: serializedPieceRates,
    state,
  };
};

export default timestamp(postSerializer);
