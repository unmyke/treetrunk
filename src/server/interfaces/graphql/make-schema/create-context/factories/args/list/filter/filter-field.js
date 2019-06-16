import { inputObjectType } from 'nexus';

const FilterFieldInput = () =>
  inputObjectType({
    name: 'FilterFieldInput',
    definition(t) {
      t.string('name');
      t.string('value');
    },
  });
export default FilterFieldInput;
