import { enumType } from 'nexus';

const DeletableEntityStateEnum = enumType({
  name: 'DeletableEntityStateEnum',
  members: ['ACTIVE', 'DELETED'],
  description: 'States of deletable entities',
});

export default DeletableEntityStateEnum;
