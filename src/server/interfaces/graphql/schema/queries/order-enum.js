import { enumType } from 'nexus';

const OrdeEnum = enumType({
  name: 'OrdeEnum',
  members: [-1, 1],
  description: 'Order values',
});

export default OrdeEnum;
