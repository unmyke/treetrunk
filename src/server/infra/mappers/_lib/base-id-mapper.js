const BaseIdMapper = ({ Entity, commonTypes }) => {
  const toDatabase = ({ value }) => value;
  const toEntity = ({ value }) =>
    new commonTypes[Entity.constructor.EntityIdName]({ value });

  return Object.freeze({
    toDatabase,
    toEntity,
  });
};

export default BaseIdMapper;
