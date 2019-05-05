import { inputObjectType } from 'nexus';

const Sort = inputObjectType({
  name: 'SortInput',
  definition(t) {
    t.string('field', { required: false });
    t.string('order', { required: false });
  },
});

export default Sort;
