import { fn } from 'jest';
import container from '@container';
import {
  seniorityType as seniorityTypeMock,
  awards as awardsMock,
} from '../mocks';

const {
  entities: {
    SellerManagement: { SeniorityType },
  },
  commonTypes: { SeniorityTypeId },
} = container;

const getSeniorityTypeByMonthsMock = fn((months) => {
  return Promise.resolve(seniorityType);
});
export default getSeniorityTypeByMonthsMock;
