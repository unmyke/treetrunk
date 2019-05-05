import { enumType } from 'nexus';

const SellerState = enumType({
  name: 'SellerState',
  description: 'Seller states',
  members: ['NEW', 'RECRUITED', 'DISMISS', 'DELETED'],
});

export default SellerState;
