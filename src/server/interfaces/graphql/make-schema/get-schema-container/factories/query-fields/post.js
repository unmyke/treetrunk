const postQueryField = (ctx) => {
  const {
    types: { Post },
    utils: { getTypeByIdQueryField },
  } = ctx;

  return getTypeByIdQueryField(Post);
};
export default postQueryField;
