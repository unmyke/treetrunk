import { mutationField } from 'nexus';

import getArgs from './args';
import resolve from './resolver';

const deleteAward = (ctx) => {
  const {
    types: { SeniorityType },
  } = ctx;
  const args = getArgs(ctx);

  return mutationField('deleteSeniorityTypeAwardAt', {
    type: SeniorityType,
    description: "Delete seniorityType's award at day",
    args,
    resolve,
  });
};
export default deleteAward;
