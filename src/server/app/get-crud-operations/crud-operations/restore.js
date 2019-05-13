import getIdPropName from './get-id-class-name';

const Restore = (EntityName) => ({
  repositories: { [EntityName]: entityRepo },
  commonTypes: { [getIdPropName(EntityName)]: Id },
}) => (idValue) =>
  entityRepo.getById(new Id({ value: idValue })).then((entity) => {
    entity.restore();
    return entityRepo.save(entity);
  });

export default Restore;
