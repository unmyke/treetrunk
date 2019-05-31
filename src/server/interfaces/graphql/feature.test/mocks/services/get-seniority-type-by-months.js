import getMockEntityFactory from '../get-mock-entity-factory';
const seniorityTypeFactory = getMockEntityFactory({
  subdomainName: 'SellerManagement',
  entityName: 'SeniorityType',
});

const getSeniorityTypeByMonthsMock = (months) =>
  seniorityTypeFactory({ months });
export default getSeniorityTypeByMonthsMock;
