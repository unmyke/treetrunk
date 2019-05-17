import { inputObjectType } from 'nexus';

const SellerInput = inputObjectType({
  name: 'SellerInput',
  definition(t) {
    t.string('firstName');
    t.string('middleName');
    t.string('lastName');
    t.phone('phone');
  },
});

export default SellerInput;
