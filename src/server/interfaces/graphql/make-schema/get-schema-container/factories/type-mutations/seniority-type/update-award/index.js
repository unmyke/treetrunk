import getArgs from './args';
import resolve from './resolver';

const updateAward = (ctx) => {
  const {
    types: { SeniorityType },
    utils: { getSchemaItem },
  } = ctx;

  const args = getSchemaItem(getArgs);

  return {
    name: 'updateAwardTo',
    description: "Update seniorityType's award at day to new value and day",
    type: SeniorityType,
    args,
    resolve,
  };
};
export default updateAward;
