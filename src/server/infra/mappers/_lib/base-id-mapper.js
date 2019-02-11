const BaseIdMapper = (idName) => ({ commonTypes }) => {
  const toDatabase = ({ value }) => value;
  const toEntity = ({ value }) => new commonTypes[idName]({ value });

  return Object.freeze({
    toDatabase,
    toEntity,
  });
};

export default BaseIdMapper;
