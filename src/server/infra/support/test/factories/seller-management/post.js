import { getDaysSequence } from '../_lib/day-utils';

const Post = (factory, { Post }) => {
  factory.define('post', Post, ({ pieceRatesCount = 1 }) => {
    return {
      postId: factory.chance('guid', { version: 4 }),
      name: factory.chance('word', { length: 40 }),
      state: factory.chance('pickone', ['active', 'deleted']),
      pieceRates: () =>
        getDaysSequence({ count: pieceRatesCount }).map((day) => ({
          value: factory.chance('floating', { fixed: 1, min: 0, max: 20 }),
          day,
        })),
    };
  });
};

export default Post;
