import getArgs from './args';
import resolve from './resolver';

const createAward = (ctx) => {
  const {
    types: { SeniorityType },
    utils: { getSchemaItem, getMutationField },
  } = ctx;
  const args = getSchemaItem(getArgs);

  return getMutationField(
    {
      name: 'createAward',
      type: SeniorityType,
      description: 'Add award to seniorityType',
      args,
      resolve,
    },
    SeniorityType
  );
};
export default createAward;
