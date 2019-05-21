import container from '@container';
import getPost from './post';

const {
  entities: {
    SellerManagement: { Seller },
  },
  commonTypes: { PostId },
  tests: {
    infra: { factory },
  },
} = container;

const getSeller = (id) => {
  const sellerData = factory.build('seller', { sellerId: id }).get();

  const seller = new Seller(sellerData);
  sellerData.appointments.forEach(({ postId, day }) => {
    seller.addAppointment(postId);
  });
};
export default getSeller;
