import { Post as getPostInput } from '../inputs';

const updatePostArgs = (ctx) => {
  const {
    utils: { getOperationArgs, getSchemaItem },
  } = ctx;
  const PostInput = getSchemaItem(getPostInput);

  return getOperationArgs('UpdatePostInput', (t) => {
    t.id('id', { required: true });
    t.field('post', { type: PostInput, required: true });
  });
};
export default updatePostArgs;
