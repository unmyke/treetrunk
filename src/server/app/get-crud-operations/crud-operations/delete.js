import getIdPropName from './get-id-class-name';

const Delete = (EntityName) => ({
  repositories: { [EntityName]: entityRepo },
  commonTypes: { [getIdPropName(EntityName)]: Id },
}) => (idValue) =>
  entityRepo.getById(new Id({ value: idValue })).then((entity) => {
    entity.delete();
    return entityRepo.save(entity);
  });

export default Delete;
