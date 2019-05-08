import { enumType } from 'nexus';

const DeletableEntityState = enumType({
  name: 'DeletableEntityState',
  members: ['active', 'deleted'],
  description: 'States of deletable entities',
});

export default DeletableEntityState;
