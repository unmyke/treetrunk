const postMutationField = (ctx) => {
  const {
    types: { Post },
    utils: { getTypeMutationField },
  } = ctx;

  return getTypeMutationField(Post);
};
export default postMutationField;
