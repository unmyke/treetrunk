import getArgs from './args';

const updatePost = (ctx) => {
  const {
    types: { Post },
    utils: { getUpdateTypeMutationField, getSchemaItem },
  } = ctx;
  const args = getSchemaItem(getArgs);

  return getUpdateTypeMutationField(Post, { args });
};
export default updatePost;
