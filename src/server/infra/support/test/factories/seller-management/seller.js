import { getDaysSequence, getRandomDay } from '../_lib/day-utils';

const Seller = (factory, { Seller }) => {
  factory.define('seller', Seller, ({ appointmentsCount = 1 }) => {
    return {
      sellerId: factory.chance('guid', { version: 4 }),
      lastName: factory.chance('last'),
      firstName: factory.chance('name'),
      middleName: factory.chance('name', { middle: true }),
      phone: factory.chance('phone'),
      state: 'recruited',
      appointments: () =>
        getDaysSequence({ count: appointmentsCount }).map((day) => ({
          postId: factory.assoc('post', 'postId'),
          day,
        })),
      createdAt: () => getRandomDay(),
    };
  });
};

export default Seller;
