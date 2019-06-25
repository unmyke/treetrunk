import getArgs from './args';
import resolve from './resolver';

const deleteAward = (ctx) => {
  const {
    types: { SeniorityType },
    utils: { getSchemaItem },
  } = ctx;
  const args = getSchemaItem(getArgs);

  return {
    name: 'deleteAwardAt',
    type: SeniorityType,
    description: "Delete seniorityType's award at day",
    args,
    resolve,
  };
};
export default deleteAward;
