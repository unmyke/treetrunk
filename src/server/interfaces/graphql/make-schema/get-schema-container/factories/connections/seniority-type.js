const SeniorityTypeConnection = (ctx) => {
  const {
    utils: { getTypeConnection },
    types: { SeniorityType },
  } = ctx;

  return getTypeConnection(SeniorityType);
};
export default SeniorityTypeConnection;
