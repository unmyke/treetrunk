const seniorityTypesQueryField = (ctx) => {
  const {
    types: { SeniorityType },
    utils: { getTypeListQueryField },
  } = ctx;

  return getTypeListQueryField(SeniorityType);
};
export default seniorityTypesQueryField;
