const BaseRepository = ({ Model, mapper }) => {
  const find = (query) => {
    return Model.find(query).then(
      (entity) => mapper.toEntity(entity),
      (error) => {
        throw error;
      }
    );
  };

  const getById = (id) => find({ _id: id });

  const getOne = (_id) => {
    return Model.findOne({ _id }).then(
      (entity) => (entity ? mapper.toEntity(entity) : null),
      (error) => {
        throw error;
      }
    );
  };

  const save = (entity) => {
    const modelProps = mapper.toDatabase(entity);
    const model = new Model(modelProps);
    return model.save().then(
      (res) => {
        const entity = mapper.toEntity(model.get());
        return entity;
      },
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
