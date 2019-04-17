import { getDaysSequence } from '../_lib/day-utils';

const Seller = (factory, { Seller }) => {
  factory.define('seller', Seller, ({ appointmentsCount = 1 }) => {
    return {
      sellerId: factory.chance('guid', { version: 4 }),
      lastName: factory.chance('last'),
      firstName: factory.chance('name'),
      middleName: factory.chance('name', { middle: true }),
      phone: factory.chance('phone'),
      state: 'recruited',
      appointments: () => {
        const days = getDaysSequence({ count: appointmentsCount });
        console.log(days);

        return days.map((day) => ({
          postId: factory.assoc('post', 'postId'),
          day,
        }));
      },
    };
  });
};

export default Seller;
