import { fn } from 'jest';
import container from '@container';
import {
  seller as sellerMock,
  appointments as appointmentsMock,
} from '../mocks';

const {
  entities: {
    SellerManagement: { Seller },
  },
  commonTypes: { SellerId, PostId, Day },
} = container;

const getSellerMock = fn((id) => {
  const {
    sellerId,
    firstName,
    middleName,
    lastName,
    phone,
    createdAt,
  } = sellerMock(id);
  const seller = new Seller({
    sellerId: new SellerId({ value: sellerId }),
    firstName,
    middleName,
    lastName,
    phone,
    createdAt,
  });

  appointmentsMock.forEach(({ postId, day }) => {
    seller.addApointment(
      new PostId({ value: postId }),
      new Day({ value: day })
    );
  });

  return Promise.resolve(seller);
});
export default getSellerMock;
