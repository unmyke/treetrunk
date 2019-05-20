import { enumType } from 'nexus';

const DeletableEntityStateEnum = enumType({
  name: 'DeletableEntityStateEnum',
  description: 'States of deletable entities',
  members: {
    ACTIVE: 'active',
    DELETED: 'deleted',
  },
});

export default DeletableEntityStateEnum;
