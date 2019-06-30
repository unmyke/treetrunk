const postsQueryField = (ctx) => {
  const {
    types: { Post },
    utils: { getTypeListQueryField },
  } = ctx;

  return getTypeListQueryField(Post);
};
export default postsQueryField;
