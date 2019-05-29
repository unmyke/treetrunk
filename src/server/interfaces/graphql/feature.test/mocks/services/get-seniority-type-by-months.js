import { fn } from 'jest';
import container from '@container';
import {
  seniorityType as seniorityTypeMock,
  awards as awardsMock,
} from '../mocks';
import { Day } from '@interfaces/http/serializers/common-types';

const {
  entities: {
    SellerManagement: { SeniorityType },
  },
  commonTypes: { Day, SeniorityTypeId },
} = container;

const getSeniorityTypeByMonthsMock = fn((months) => {
  const seniorityTypeId = new SeniorityTypeId({ value: seniorityTypeIdValue });
  const seniorityType = new SeniorityType({
    ...seniorityTypeMock(),
    seniorityTypeId,
    months,
    name: 'Mock',
  });
  awardsMock.forEach(({ value, day }) => {
    seniorityType.addAward(value, new Day({ value: day }));
  });
  return Promise.resolve(seniorityType);
});
export default getSeniorityTypeByMonthsMock;
