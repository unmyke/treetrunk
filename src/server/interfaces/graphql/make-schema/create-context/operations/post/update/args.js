import { inputObjectType } from 'nexus';
import { Post as getPostInput } from '../inputs';

const UpdateInput = (ctx) => {
  const PostInput = getPostInput(ctx);

  return inputObjectType({
    name: 'UpdatePostInput',
    definition: (t) => {
      t.id('id', { required: true });
      t.field('post', { type: PostInput, required: true });
    },
  });
};
export default UpdateInput;
