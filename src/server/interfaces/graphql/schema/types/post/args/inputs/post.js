import { inputObjectType } from 'nexus';

const PostInput = inputObjectType({
  name: 'PostInput',
  definition(t) {
    t.string('name');
  },
});

export default PostInput;
