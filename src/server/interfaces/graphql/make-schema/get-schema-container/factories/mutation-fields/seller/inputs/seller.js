import { inputObjectType } from 'nexus';

const SellerInput = (ctx) => {
  const {
    scalars: { Phone },
  } = ctx;

  return inputObjectType({
    name: 'SellerInput',
    definition(t) {
      t.string('firstName');
      t.string('middleName');
      t.string('lastName');
      t.field('phone', { type: Phone });
    },
  });
};

export default SellerInput;
