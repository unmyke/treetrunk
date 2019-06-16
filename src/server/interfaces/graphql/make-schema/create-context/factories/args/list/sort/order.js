import { enumType } from 'nexus';

const OrderEnum = () =>
  enumType({
    name: 'OrderEnum',
    description: 'Order values',
    members: {
      ASC: 'asc',
      DESC: 'desc',
    },
  });
export default OrderEnum;
