import { enumType } from 'nexus';

const OrderEnum = enumType({
  name: 'OrderEnum',
  description: 'Order values',
  members: ['asc', 'desc'],
});

export default OrderEnum;
