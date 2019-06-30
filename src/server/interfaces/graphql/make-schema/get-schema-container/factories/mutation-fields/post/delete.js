const deletePsot = (ctx) => {
  const {
    types: { Post },
    utils: { getDeleteTypeMutationField },
  } = ctx;

  return getDeleteTypeMutationField(Post);
};
export default deletePsot;
