import { mutationField } from 'nexus';

import getArgs from './args';
import resolve from './resolver';

const createAward = (ctx) => {
  const {
    types: { SeniorityType },
  } = ctx;
  const args = getArgs(ctx);

  return mutationField('createSeniorityTypeAward', {
    type: SeniorityType,
    description: 'Add award to seniorityType',
    args,
    resolve,
  });
};
export default createAward;
