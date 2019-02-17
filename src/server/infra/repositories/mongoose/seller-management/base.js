const BaseRepository = ({ Model, mapper }) => {
  const idPropName = `${Model.name.toLowerCase()}Id`;

  const find = (query) => {
    return Model.find(query).then(
      (model) => mapper.toEntity(model),
      (error) => {
        throw error;
      }
    );
  };

  const getById = (id) => find({ [idPropName]: id });

  const getOne = (query) => {
    return Model.findOne(query).then(
      (model) => {
        console.log(model);
        return model ? mapper.toEntity(model.get()) : null;
      },
      (error) => {
        throw error;
      }
    );
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
    getById,
    getOne,
    save,
    add: save,
  });
};
export default BaseRepository;
