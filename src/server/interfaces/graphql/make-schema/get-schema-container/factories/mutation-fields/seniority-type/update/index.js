import getArgs from './args';

const updateSeniorityType = (ctx) => {
  const {
    types: { SeniorityType },
    utils: { getUpdateTypeMutationField, getSchemaItem },
  } = ctx;
  const args = getSchemaItem(getArgs);

  return getUpdateTypeMutationField(SeniorityType, { args });
};
export default updateSeniorityType;
