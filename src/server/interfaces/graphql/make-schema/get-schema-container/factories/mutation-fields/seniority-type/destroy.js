const destroyField = (ctx) => {
  const {
    types: { SeniorityType },
    utils: { getDestroyTypeMutationField },
  } = ctx;

  return getDestroyTypeMutationField(SeniorityType);
};
export default destroyField;
