const restorePost = (ctx) => {
  const {
    types: { Post },
    utils: { getRestoreTypeMutationField },
  } = ctx;

  return getRestoreTypeMutationField(Post);
};
export default restorePost;
