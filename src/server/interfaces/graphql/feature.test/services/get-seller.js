import getEntityFactory from './get-entity-factory';

const getSellerMock = getEntityFactory({
  subdomainName: 'SellerManagement',
  entityName: 'Seller',
});
export default getSellerMock;
