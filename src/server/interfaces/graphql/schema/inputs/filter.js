import { inputObjectType } from 'nexus';

const Filter = inputObjectType({
  name: 'FilterInput',
  definition(t) {
    t.string('text', { required: false });
    t.list.string('fields', { required: false });
  },
});

export default Filter;
