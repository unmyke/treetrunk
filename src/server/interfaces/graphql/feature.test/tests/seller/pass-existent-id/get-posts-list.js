import { fn } from 'jest';
import container from '@container';
import { appointments as appointmentsMock } from '../mocks';

const {
  entities: {
    SellerManagement: { Post },
  },
  commonTypes: { PostId },
} = container;

const { firstName, middleName, lastName, phone, createdAt } = sellerMock;

const getSellerMock = fn((id) => {
  const seller = new Seller({
    sellerId: new SellerId({ value: id }),
    firstName,
    middleName,
    lastName,
    phone,
    createdAt,
  });

  seller.addApointment(
    new PostId({ value: appointmentsMock[0].postId }),
    new Day({ value: appointmentsMock[0].day })
  );

  return seller;
});
export default getSellerMock;
