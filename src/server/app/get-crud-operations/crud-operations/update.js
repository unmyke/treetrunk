import getIdClassName from './get-id-class-name';

const Update = (EntityName) => ({
  repositories: { [EntityName]: entityRepo },
  commonTypes: { [getIdClassName(EntityName)]: Id },
}) => (idValue, fields) =>
  entityRepo.getById(new Id({ value: idValue })).then((entity) => {
    entity.update(fields);
    return entityRepo.save(entity);
  });

export default Update;
