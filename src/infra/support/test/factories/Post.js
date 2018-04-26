export const Post = (factory, { Post }) => {
  factory.define('post', Post, {
    name: factory.chance('word'),
    state: 'active',
  });
};
