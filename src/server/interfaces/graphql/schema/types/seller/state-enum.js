import { enumType } from 'nexus';

const SellerStateEnum = enumType({
  name: 'SellerStateEnum',
  description: 'Seller states',
  members: ['new', 'recruited', 'dismiss', 'deleted'],
});

export default SellerStateEnum;
