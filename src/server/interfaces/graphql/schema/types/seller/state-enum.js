import { enumType } from 'nexus';

const SellerStateEnum = enumType({
  name: 'SellerStateEnum',
  description: 'Seller states',
  members: ['NEW', 'RECRUITED', 'DISMISS', 'DELETED'],
});

export default SellerStateEnum;
