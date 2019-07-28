import getListFactory from './get-list-factory';

const getPostsListMock = getListFactory({
  subdomainName: 'SellerManagement',
  entityName: 'Post',
  count: 10,
  hasAfter: false,
  hasBefore: true,
});
export default getPostsListMock;
