import getIdClassName from './get-id-class-name';

const GetList = (EntityName) => ({
  repositories: { [EntityName]: entityRepo },
  commonTypes: { [getIdClassName(EntityName)]: Id },
}) => ({ id: idValue, ...paginationOptions }) => {
  return entityRepo.getList({
    id: new Id({ value: idValue }),
    ...paginationOptions,
  });
};

export default GetList;
