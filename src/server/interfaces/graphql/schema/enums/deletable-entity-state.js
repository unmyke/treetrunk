import { enumType } from 'nexus';

const DeletableEntityState = enumType({
  name: 'DeletableEntityState',
  members: ['ACTIVE', 'DELETED'],
  description: 'States of deletable entities',
});

export default DeletableEntityState;
