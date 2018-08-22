export const Post = (factory, { Post, PostPieceRate }) => {
  factory.define(
    'post',
    Post,
    ({ post_id, name } = {}) => ({
      post_id: post_id || factory.chance('guid', { version: 4 }),
      name: name || factory.chance('word'),
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
