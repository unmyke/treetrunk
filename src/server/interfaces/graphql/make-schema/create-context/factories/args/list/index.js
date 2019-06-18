import getFilterInput from './filter';
import getSortInput from './sort';

const listArgs = (ctx) => {
  const {
    utils: { getOperationArgs },
    scalars: { Cursor, PositiveInt },
  } = ctx;
  const FilterInput = getFilterInput(ctx);
  const SortInput = getSortInput(ctx);

  return getOperationArgs('GetListInput', (t) => {
    t.field('first', { type: PositiveInt, required: false });
    t.field('after', { type: Cursor, required: false });
    t.field('last', { type: PositiveInt, required: false });
    t.field('before', { type: Cursor, required: false });
    t.field('filter', { type: FilterInput, required: false });
    t.field('sort', { type: SortInput, required: false });
  });
};
export default listArgs;
