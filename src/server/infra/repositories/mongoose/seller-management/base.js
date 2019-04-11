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

  const getList = Model.getList.bind(Model);

  const getById = (id) => findModel(id).then(mapToEntity, throwError);

  const getOne = (query) => {
    return Model.findOne(query).then(mapToEntity, throwError);
  };

  const save = (entity) => {
    const modelProps = mapper.toDatabase(entity);
    const model = new Model(modelProps);
    return model.save().then(
      () => mapper.toEntity(model.get()),
      (error) => {
        throw error;
      }
    );
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
