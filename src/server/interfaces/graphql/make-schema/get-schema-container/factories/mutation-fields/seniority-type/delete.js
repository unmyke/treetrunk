const deleteField = (ctx) => {
  const {
    types: { SeniorityType },
    utils: { getDeleteTypeMutationField },
  } = ctx;

  return getDeleteTypeMutationField(SeniorityType);
};
export default deleteField;
