import { enumType } from 'nexus';

const SellerStateEnum = enumType({
  name: 'SellerStateEnum',
  description: 'Seller states',
  members: ['new', 'recruited', 'dismissed', 'deleted'],
});

export default SellerStateEnum;
