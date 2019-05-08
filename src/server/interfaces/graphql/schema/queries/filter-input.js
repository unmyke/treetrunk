import { inputObjectType } from 'nexus';

import FilterFieldInput from './filter-field-input';

const FilterInput = inputObjectType({
  name: 'FilterInput',
  definition(t) {
    t.string('text', { required: false });
    t.list.field('fields', { type: FilterFieldInput, required: false });
  },
});

export default FilterInput;