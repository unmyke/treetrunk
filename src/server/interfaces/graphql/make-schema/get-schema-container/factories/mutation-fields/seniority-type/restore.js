const restoreField = (ctx) => {
  const {
    types: { SeniorityType },
    utils: { getRestoreTypeMutationField },
  } = ctx;

  return getRestoreTypeMutationField(SeniorityType);
};
export default restoreField;
