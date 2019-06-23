import { mutationField } from 'nexus';

import getArgs from './args';
import resolve from './resolver';

const updateAward = (ctx) => {
  const args = getArgs(ctx);

  return mutationField('updateSeniorityTypeAwardTo', {
    description: "Update seniorityType's award at day to new value and day",
    args,
    resolve,
  });
};
export default updateAward;
