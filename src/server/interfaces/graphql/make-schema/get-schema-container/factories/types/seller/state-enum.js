import { enumType } from 'nexus';

const SellerStateEnum = () =>
  enumType({
    name: 'SellerStateEnum',
    description: 'Seller states',
    members: {
      NEW: 'new',
      RECRUITED: 'recruited',
      DISMISSED: 'dismissed',
      DELETED: 'deleted',
    },
  });

export default SellerStateEnum;
