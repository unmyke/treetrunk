import { mutationField } from 'nexus';

import SeniorityType from '../../seniority-type';
import args from './args';
import resolve from './resolver';

const createAward = mutationField('createSeniorityTypeAward', {
  type: SeniorityType,
  description: 'Add award to seniorityType',
  args,
  resolve,
});
export default createAward;
