const seniorityTypeMutationField = (ctx) => {
  const {
    types: { SeniorityType },
    utils: { getTypeMutationField },
  } = ctx;

  return getTypeMutationField(SeniorityType);
};
export default seniorityTypeMutationField;
