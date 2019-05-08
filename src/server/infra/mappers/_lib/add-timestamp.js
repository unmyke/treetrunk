const addTimpestamp = (Mapper) => (opts) => {
  const mapper = Mapper(opts);

  const toDatabase = (entity) => ({
    ...mapper.toDatabase(entity),
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    deletedAt: entity.deletedAt,
  });

  const toEntity = ({ createdAt, updatedAt, deletedAt, ...data }) =>
    mapper.toEntity({
      ...data,
      createdAt,
      updatedAt,
      deletedAt,
    });

  return Object.freeze({ toEntity, toDatabase });
};

export default addTimpestamp;
