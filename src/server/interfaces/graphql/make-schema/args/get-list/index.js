import { arg } from 'nexus';
import {
  Cursor as CursorScalar,
  PositiveInt as PositiveIntScalar,
} from '../../scalars';
import FilterInput, { contains as FilterInputContains } from './filter';
import SortInput, { contains as SortInputContains } from './sort';

const connectionArgs = {
  first: arg({ type: PositiveIntScalar, required: false }),
  after: arg({ type: CursorScalar, required: false }),
  last: arg({ type: PositiveIntScalar, required: false }),
  before: arg({ type: CursorScalar, required: false }),
  filter: arg({ type: FilterInput, required: false }),
  sort: arg({ type: SortInput, required: false }),
};

export default connectionArgs;
export const contains = [
  ...FilterInputContains,
  FilterInput,
  ...SortInputContains,
  SortInput,
];
