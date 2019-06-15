import { Day } from '@domain/common-types';

const createGetSeller = ({ getSeller, getPost }) => (id) => {
  const seller = getSeller(id);
  const post = getPost();
  const day = new Day({ value: new Date('201-01-01') });
  seller.addAppointment(post.postId, day);

  return seller;
};

export default createGetSeller;
