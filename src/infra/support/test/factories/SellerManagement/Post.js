export const Post = (factory, { Post }) => {
  factory.define(
    'post',
    Post,
    ({ post_id, name, state } = {}) => ({
      post_id: post_id || factory.chance('guid', { version: 4 }),
      name: name || factory.chance('word'),
      state: state || factory.chance('pickone', ['active', 'inactive']),
    }),
    {
      afterCreate: function(post, attrs, { pieceRatesCount } = {}) {
        factory.createMany('postPieceRate', pieceRatesCount || 3, {
          post_id: post.post_id,
        });

        return post;
      },
    }
  );
};
