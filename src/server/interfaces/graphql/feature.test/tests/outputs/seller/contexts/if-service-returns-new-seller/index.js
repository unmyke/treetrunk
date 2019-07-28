import uuidv4 from 'uuid/v4';
import createGetSeller from './create-get-seller';

const ifServiceReturnsRecuitedSeller = ({
  getApolloClient,
  operations,
  services,
}) => {
  context('if service returns recuited seller', () => {
    test(`should return seller with corresponding id`, async () => {
      const {
        getSeller,
        getPost,
        getSeniorityTypeByMonths,
        getPostsList,
      } = services;
      // const getPostsList = createGetPostsList(services);
      const id = uuidv4();
      const servicesToMock = {
        getSeller,
        getPost,
        getPostsList,
        getSeniorityTypeByMonths,
      };
      const { query, mockServices } = getApolloClient(servicesToMock);

      const res = query({
        query: operations.SELLER,
        variables: { id },
      });

      await expect(res).not.haveErrors();
      await expect(res).haveSeller(mockServices);
    });
  });
};

export default ifServiceReturnsRecuitedSeller;
