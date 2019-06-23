const PostConnection = (ctx) => {
  const {
    utils: { getTypeConnection },
    types: { Post },
  } = ctx;

  return getTypeConnection(Post);
};
export default PostConnection;
