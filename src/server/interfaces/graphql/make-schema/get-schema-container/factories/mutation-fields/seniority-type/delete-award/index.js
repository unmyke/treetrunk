import getArgs from './args';
import resolve from './resolver';

const deleteAward = (ctx) => {
  const {
    types: { SeniorityType },
    utils: { getSchemaItem, getMutationField },
  } = ctx;
  const args = getSchemaItem(getArgs);

  return getMutationField(
    {
      name: 'deleteAwardAt',
      type: SeniorityType,
      description: "Delete seniorityType's award at day",
      args,
      resolve,
    },
    SeniorityType
  );
};
export default deleteAward;
