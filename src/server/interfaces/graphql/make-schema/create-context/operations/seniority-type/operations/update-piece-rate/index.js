import { mutationField } from 'nexus';

import SeniorityType from '../../seniority-type';
import args from './args';
import resolve from './resolver';

const updateAward = mutationField('updateSeniorityTypeAwardTo', {
  type: SeniorityType,
  description: "Update seniorityType's award at day to new value and day",
  args,
  resolve,
});
export default updateAward;
