import uuidv4 from 'uuid/v4';
import getPostsList from './get-posts-list';

const passExistentIdContext = ({ getApolloClient, queries, mocks }) => {
  context('if pass existent id', () => {
    test(`should return seller with corresponding id`, async () => {
      const {
        services: { getSeller, getPost, getSeniorityTypeByMonths },
      } = mocks;
      const id = uuidv4();
      const { query, mockServices } = getApolloClient({
        getSeller,
        getPost,
        getPostsList,
        getSeniorityTypeByMonths,
      });

      const res = query({
        query: queries.SELLER,
        variables: { id },
      });

      await expect(res).not.haveErrors();
      await expect(res).haveSeller(mockServices);

      // expect(mockServices.getPost.mock.calls.length).toBe(3);
      // expect(mockServices.getSeller.mock.calls.length).toBe(1);
      // expect(mockServices.getPostsList.mock.calls.length).toBe(1);
      // expect(mockServices.getSeniorityTypeByMonths.mock.calls.length).toBe(1);

      // expect(data).toHaveProperty('seller');
      // const { seller } = data;
      // expect(seller.id).toEqual(id);
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
};

export default passExistentIdContext;
