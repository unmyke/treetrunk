import timestamp from './timestamp';
import id from './id';
import day from './day';

const serializers = { id, day };

const postSerializer = ({ postId, name, pieceRate, pieceRates, state }) => {
  return {
    __type: 'Post',
    id: serializers.id(postId),
    name,
    pieceRate,
    pieceRates: pieceRates.map(({ value, day }) => ({
      value,
      day: serializers.day(day),
    })),
    state,
  };
};

export default timestamp(postSerializer);
