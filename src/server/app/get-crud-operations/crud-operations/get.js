import getIdClassName from './get-id-class-name';

const Get = (EntityName) => ({
  repositories: { [EntityName]: entityRepo },
  commonTypes: { [getIdClassName(EntityName)]: Id },
}) => (idValue) => entityRepo.getById(new Id({ value: idValue }));

export default Get;
