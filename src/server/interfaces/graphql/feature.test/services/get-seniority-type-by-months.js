import { createFactory } from '../entity-factory';

const seniorityTypeFactory = createFactory({
  subdomainName: 'SellerManagement',
  entityName: 'SeniorityType',
});

const getSeniorityTypeByMonthsMock = (months) =>
  seniorityTypeFactory({ months });
export default getSeniorityTypeByMonthsMock;
