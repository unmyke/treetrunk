const Seller = (factory, { Seller }, attrs) => {
  factory.define(
    'seller',
    Seller,
    (buildOptions) => ({
      seller_id: factory.chance('guid', { version: 4 }),
      last_name: factory.chance('last'),
      first_name: factory.chance('name'),
      middle_name: factory.chance('name', { middle: true }),
      phone: factory.chance('phone'),
      state: 'recruited',
    }),
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
          seller_id: seller.seller_id,
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
