import { mutationField } from 'nexus';

import SeniorityType from '../../seniority-type';
import args from './args';
import resolve from './resolver';

const deleteAward = mutationField('deleteSeniorityTypeAwardAt', {
  type: SeniorityType,
  description: "Delete seniorityType's award at day",
  args,
  resolve,
});
export default deleteAward;
