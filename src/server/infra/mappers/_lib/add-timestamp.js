const addTimpestamp = (Mapper) => (opts) => {
  const mapper = Mapper(opts);

  const toDatabase = ({ createdAt, updatedAt, deletedAt, ...entity }) => ({
    ...mapper.toDatabase(entity),
    createdAt,
    updatedAt,
    deletedAt,
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
