const destroyPost = (ctx) => {
  const {
    types: { Post },
    utils: { getDestroyTypeMutationField },
  } = ctx;

  return getDestroyTypeMutationField(Post);
};
export default destroyPost;
