import getEntityFactory from './get-entity-factory';

const getPostMock = getEntityFactory({
  subdomainName: 'SellerManagement',
  entityName: 'Post',
});
export default getPostMock;
