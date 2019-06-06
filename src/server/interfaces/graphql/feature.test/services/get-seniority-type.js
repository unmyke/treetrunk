import getEntityFactory from './get-entity-factory';

const getSeniorityTypeMock = getEntityFactory({
  subdomainName: 'SellerManagement',
  entityName: 'SeniorityType',
});
export default getSeniorityTypeMock;
