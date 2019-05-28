describe(`:: Queries`, () => {
  describe(`:: Seller`, () => {
    describe(`#seller`, () => {
      let sellerModel;

      beforeEach(() =>
        factory.create('seller').then((s) => {
          sellerModel = s.get();
        })
      );

      context('if pass existent id', () => {
        test(`should return seller with corresponding id`, () =>
          query({
            query: queries.SELLER,
            variables: { id: sellerModel.sellerId },
          }).then(({ data, errors }) => {
            expect(errors).toBeUndefined();
            expect(data).toHaveProperty('seller');
            const { seller } = data;
            expect(seller.id).toEqual(sellerModel.sellerId);
            expect(seller.firstName).toBe(sellerModel.firstName);
            expect(seller.middleName).toBe(sellerModel.middleName);
            expect(seller.lastName).toBe(sellerModel.lastName);
            expect(seller.appointments).toHaveLength(
              sellerModel.appointments.length
            );
            expect(seller.appointments[0].postId).toBe(
              sellerModel.appointments[0].postId
            );
            expect(seller.appointments[0].day).toBe(
              startOfDay(sellerModel.appointments[0].day).getTime()
            );
            expect(seller.postId).toBe(sellerModel.appointments[0].postId);
            expect(seller.postIds).toHaveLength(
              sellerModel.appointments.length
            );
          }));
      });
      context('if pass unexistent id', () => {
        test(`should return error`, () =>
          query({
            query: queries.SELLER,
            variables: { id: uuidv4() },
          }).then(({ data, errors }) => {
            expect(errors).toHaveLength(1);
            expect(errors[0]).toBeInstanceOf(GraphQLError);
            expect(errors[0].message).toBe('SELLER_NOT_FOUND');
            expect(data).toBeNull();
          }));
      });

      context('if id not passed', () => {
        test(`should return error`, () =>
          query({
            query: queries.SELLER,
            variables: {},
          }).then(({ data, errors }) => {
            expect(errors).toHaveLength(1);
            expect(errors[0]).toBeInstanceOf(GraphQLError);
            expect(errors[0].message).toBe(
              'Variable "$id" of required type "ID!" was not provided.'
            );
            expect(data).toBeUndefined();
          }));
      });
    });
    describe(`#getSellers`, () => {
      let sellerModels;

      beforeEach(() =>
        factory.createMany('seller', 10).then((sellers) => {
          sellerModels = sellers.map((s) => s.get());
        })
      );

      context('if pass no args', () => {
        test(`should return deafult count of sellers`, () =>
          query({
            query: queries.SELLERS,
            variables: {},
          }).then(({ data, errors }) => {
            expect(errors).toBeUndefined();
            expect(data).toHaveProperty('sellers');
          }));
      });
    });
  });
});
