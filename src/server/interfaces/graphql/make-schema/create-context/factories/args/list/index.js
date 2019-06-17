import FilterInput from './filter';
import SortInput from './sort';

const listArgs = (ctx) => {
  const {
    utils: { getOperationArgs },
    scalars: { Cursor, PositiveInt },
  } = ctx;
  return getOperationArgs('GetListInput', (t) => {
    t.field('first', { type: PositiveInt, required: false });
    t.field('after', { type: Cursor, required: false });
    t.field('last', { type: PositiveInt, required: false });
    t.field('before', { type: Cursor, required: false });
    t.field('filter', { type: FilterInput(ctx), required: false });
    t.field('sort', { type: SortInput(ctx), required: false });
  });
};
export default listArgs;
