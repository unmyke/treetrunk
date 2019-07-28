import getArgs from './args';

const createPost = (ctx) => {
  const {
    types: { Post },
    utils: { getCreateTypeMutationField, getSchemaItem },
  } = ctx;
  const args = getSchemaItem(getArgs);

  return getCreateTypeMutationField(Post, { args });
};
export default createPost;
