export const Post = (factory, { Post }) => {
  factory.define('post', Post, {
    postId: factory.chance('guid', { version: 4 }),
    name: factory.chance('word'),
  });
};
