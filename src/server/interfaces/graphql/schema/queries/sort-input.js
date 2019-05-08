import { inputObjectType } from 'nexus';
import OrderEnum from './order-enum';

const Sort = inputObjectType({
  name: 'SortInput',
  definition(t) {
    t.string('field', { required: false });
    t.string('order', { type: OrderEnum, required: false });
  },
});

export default Sort;
