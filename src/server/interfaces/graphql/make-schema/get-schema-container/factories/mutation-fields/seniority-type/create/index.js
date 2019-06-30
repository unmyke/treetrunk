import getArgs from './args';

const createSeniorityType = (ctx) => {
  const {
    types: { SeniorityType },
    utils: { getCreateTypeMutationField, getSchemaItem },
  } = ctx;
  const args = getSchemaItem(getArgs);

  return getCreateTypeMutationField(SeniorityType, { args });
};
export default createSeniorityType;
