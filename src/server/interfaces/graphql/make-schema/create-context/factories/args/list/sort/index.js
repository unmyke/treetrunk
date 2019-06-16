import { inputObjectType } from 'nexus';

import OrderEnum from './order';

const Sort = (ctx) =>
  inputObjectType({
    name: 'SortInput',
    definition(t) {
      t.string('field', { required: false });
      t.string('order', { type: OrderEnum(ctx), required: false });
    },
  });
export default Sort;
