import chance from 'chance';
import container from '@container';

const {
  entities: {
    SellerManagement: { Seller },
  },
} = container;

const getSeller = () => ({
  firstName: chance.name(),
  middleName: chance.name({ middleName: true }),
  lastName: chance.lastName({ middleName: true }),
});
