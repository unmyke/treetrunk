import getIdPropName from './get-id-prop-name';

const get = (EntityName) => ({
  repositories: { [EntityName]: entityRepo },
  commonTypes: { [getIdPropName(EntityName)]: Id },
}) => (idValue) => entityRepo.getById(new Id({ value: idValue }));

export default get;
