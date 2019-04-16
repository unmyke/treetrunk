import { getDaysSequence } from '../_lib/day-utils';

const Seller = (factory, { Seller }) => {
  factory.define(
    'seller',
    Seller,
    ({ appointmentsCount = 1 }) => {
      return {
        sellerId: factory.chance('guid', { version: 4 }),
        lastName: factory.chance('last'),
        firstName: factory.chance('name'),
        middleName: factory.chance('name', { middle: true }),
        phone: factory.chance('phone'),
        state: 'recruited',
        appointments: () =>
          getDaysSequence({ count: appointmentsCount }).map((day) => ({
            postId: factory.assoc('Post'),
            day,
          })),
      };
    },
    {
      async afterCreate(seller, attrs, { appointmentsCount } = {}) {
        if (
          appointmentsCount === 0 &&
          attrs.appointments &&
          attrs.appointments.length === 0
        ) {
          return seller.reload({ include: ['appointments'] });
        }

        const appointmentAttrs = {
          sellerId: seller.sellerId,
        };

        const appointmentFactoryArgs = ['sellerAppointment'];

        switch (true) {
          case appointmentsCount !== undefined && appointmentsCount > 0:
            appointmentFactoryArgs.push(appointmentsCount, appointmentAttrs);
            break;

          case attrs.appointments !== undefined &&
            attrs.appointments.length > 0:
            appointmentFactoryArgs.push(
              attrs.appointments.map((attr) => ({
                ...attr,
                ...appointmentAttrs,
              }))
            );
            break;

          default:
            appointmentFactoryArgs.push(3, appointmentAttrs);
            break;
        }

        return factory
          .createMany(...appointmentFactoryArgs)
          .then(() => seller.reload({ include: ['appointments'] }));
      },
    }
  );
};

export default Seller;
