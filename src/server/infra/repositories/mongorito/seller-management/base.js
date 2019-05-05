const BaseRepository = ({ Model, mapper, errors }) => {
  const mapToEntity = (model) => (model ? mapper.toEntity(model.get()) : null);
  const throwError = (error) => {
    throw error;
  };

  const idPropName = `${Model.name.toLowerCase()}Id`;

  const findModel = (id) =>
    Model.findOne({
      [idPropName]: id.value,
    }).then((model) => {
      if (!model)
        throw errors.modelNotFound(
          `${Model.name} with ${idPropName}: "${id}" not found`
        );
      return model;
    });

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
  const getByIds = (ids) =>
    Model.where(idPropName)
      .in(ids.map(({ value }) => value))
      .find()
      .then((models) => models.map(mapToEntity), throwError);
  const getOne = (query) => Model.findOne(query).then(mapToEntity, throwError);
  const save = (entity) => {
    const model = new Model(mapper.toDatabase(entity));
    return model.save().then(() => mapToEntity(model), throwError);
  };

  return Object.freeze({
    getByIds,
    getList,
    getById,
    getOne,
    save,
    add: save,
  });
};
export default BaseRepository;
