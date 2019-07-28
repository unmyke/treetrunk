import timestamp from './timestamp';
import list from './list';
import id from './id';
import day from './day';

const serializers = { id, day };

const Post = timestamp(({ postId, name, pieceRate, pieceRates, state }) => ({
  __type: 'Post',
  id: serializers.id(postId),
  name,
  pieceRate,
  pieceRates: pieceRates.map(({ value, day }) => ({
    value,
    day: serializers.day(day),
  })),
  state,
}));

export default Post;
export const Posts = list(Post);
