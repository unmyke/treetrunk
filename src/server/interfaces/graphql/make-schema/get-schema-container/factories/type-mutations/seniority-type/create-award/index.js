import getArgs from './args';
import resolve from './resolver';

const createAward = (ctx) => {
  const {
    types: { SeniorityType },
    utils: { getSchemaItem },
  } = ctx;
  const args = getSchemaItem(getArgs);

  return {
    name: 'createAward',
    type: SeniorityType,
    description: 'Add award to seniorityType',
    args,
    resolve,
  };
};
export default createAward;
