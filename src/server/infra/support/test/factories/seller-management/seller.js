import { getDaysSequence, getRandomDay } from '../_lib/day-utils';

const Seller = (factory, { Seller }) => {
  factory.define('seller', Seller, ({ appointmentsCount = 1 }) => ({
    sellerId: factory.chance('guid', { version: 4 }),
    lastName: factory.chance('last'),
    firstName: factory.chance('name'),
    middleName: factory.chance('name', { middle: true }),
    phone: factory.chance('phone'),
    state: 'recruited',
    appointments: () =>
      factory
        .assoc('post', 'postId')()
        .then((postId) =>
          getDaysSequence({ count: appointmentsCount }).map((day) => ({
            postId,
            day,
          }))
        ),
    createdAt: () => getRandomDay(),
    deletedAt: () => getRandomDay(),
    updatedAt: () => getRandomDay(),
  }));
};

export default Seller;
