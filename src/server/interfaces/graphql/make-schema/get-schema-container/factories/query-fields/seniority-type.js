const seniorityTypeQueryField = (ctx) => {
  const {
    types: { SeniorityType },
    utils: { getTypeByIdQueryField },
  } = ctx;

  return getTypeByIdQueryField(SeniorityType);
};
export default seniorityTypeQueryField;
