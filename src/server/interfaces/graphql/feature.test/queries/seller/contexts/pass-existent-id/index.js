import uuidv4 from 'uuid/v4';

const passExistentIdContext = ({ getApolloClient, queries, mocks }) => {
  context('if pass existent id', () => {
    test(`should return seller with corresponding id`, () => {
      const {
        services: {
          getSeller,
          getPost,
          getPostsList,
          getSeniorityTypeByMonths,
        },
      } = mocks;
      const id = uuidv4();
      const { query } = getApolloClient({
        getSeller,
        getPost,
        getPostsList,
        getSeniorityTypeByMonths,
      });

      return query({
        query: queries.SELLER,
        variables: { id },
      }).then(({ data, errors }) => {
        expect(getSeller.mock.calls.length).toBe(1);
        expect(getPost.mock.calls.length).toBe(1);
        expect(getPostsList.mock.calls.length).toBe(1);
        expect(getSeniorityTypeByMonths.mock.calls.length).toBe(1);

        expect(errors).toBeUndefined();
        expect(data).toHaveProperty('seller');
        const { seller } = data;
        expect(seller.id).toEqual(id);
        // expect(seller.firstName).toBe(sellerMock.firstName);
        // expect(seller.middleName).toBe(sellerMock.middleName);
        // expect(seller.lastName).toBe(sellerMock.lastName);
        // expect(seller.phone).toBe(sellerMock.phone);
        // expect(seller.createdAt).toBe(sellerMock.createdAt);
        // expect(seller.postId).toBe(appointmentsMock[1].postId);
        // expect(seller.appointments).toHaveLength(appointmentsMock.length);
        // expect(seller.appointments[0].postId).toBe(appointmentsMock[0].postId);
        // expect(seller.appointments[0].day).toBe(
        //   appointmentsMock[0].day.getTime()
        // );
        // expect(seller.postId).toBe(appointmentsMock[0].postId);
        // expect(seller.postIds).toHaveLength(appointmentsMock.length);
      });
    });
  });
};

export default passExistentIdContext;
