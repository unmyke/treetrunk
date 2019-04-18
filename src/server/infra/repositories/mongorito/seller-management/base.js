const BaseRepository = ({ Model, mapper }) => {
  const mapToEntity = (model) => (model ? mapper.toEntity(model.get()) : null);
  const throwError = (error) => {
    throw error;
  };

  const idPropName = `${Model.name.toLowerCase()}Id`;

  const findModel = (id) =>
    Model.findOne({ [idPropName]: id }).then((model) =>
      model ? mapToEntity(model) : null
    );

  const getList = (query) =>
    Model.getList(query).then(
      ({ result, cursor, hasMore }) => ({
        result: result.map(mapToEntity),
        cursor,
        hasMore,
      }),
      throwError
    );
  const getById = (id) => findModel(id).then(mapToEntity, throwError);
  const getOne = (query) => Model.findOne(query).then(mapToEntity, throwError);
  const save = (entity) => {
    const model = new Model(mapper.toDatabase(entity));
    return model.save().then(() => mapToEntity(model), throwError);
  };

  return Object.freeze({
    getList,
    getById,
    getOne,
    save,
    add: save,
  });
};
export default BaseRepository;
