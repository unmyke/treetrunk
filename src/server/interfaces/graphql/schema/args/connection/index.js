import { arg, intArg } from 'nexus';
import scalars from '../../scalars';
import FilterInput, { contains as FilterInputContains } from './filter';
import SortInput, { contains as SortInputContains } from './sort';

const { Cursor: CursorScalar } = scalars;

const connectionArgs = {
  first: intArg(),
  after: arg({ type: CursorScalar }),
  last: intArg(),
  before: arg({ type: CursorScalar }),
  skip: intArg(),
  filter: arg({ type: FilterInput }),
  sort: arg({ type: SortInput }),
};

export default connectionArgs;
export const contains = [
  ...FilterInputContains,
  FilterInput,
  ...SortInputContains,
  SortInput,
];
