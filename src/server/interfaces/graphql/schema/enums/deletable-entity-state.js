import { enumType } from 'nexus';

const DeletableEntityStateEnum = enumType({
  name: 'DeletableEntityStateEnum',
  description: 'States of deletable entities',
  members: ['active', 'deleted'],
});

export default DeletableEntityStateEnum;
