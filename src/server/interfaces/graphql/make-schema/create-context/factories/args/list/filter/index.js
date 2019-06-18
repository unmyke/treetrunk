import { inputObjectType } from 'nexus';

import getFilterFieldInput from './filter-field';

const FilterInput = (ctx) => {
  const FilterFieldInput = getFilterFieldInput(ctx);

  return inputObjectType({
    name: 'FilterInput',
    definition(t) {
      t.string('text', { required: false });
      t.list.field('fields', {
        type: FilterFieldInput,
        required: false,
      });
    },
  });
};

export default FilterInput;
