import { inputObjectType } from 'nexus';

import FilterFieldInput from './filter-field';

const FilterInput = (ctx) =>
  inputObjectType({
    name: 'FilterInput',
    definition(t) {
      t.string('text', { required: false });
      t.list.field('fields', { type: FilterFieldInput(ctx), required: false });
    },
  });

export default FilterInput;
