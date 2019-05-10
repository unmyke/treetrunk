const getList = (EntityName) => ({
  repositories: { [EntityName]: entityRepo },
}) => (opts) => entityRepo.getList(opts);

export default getList;
