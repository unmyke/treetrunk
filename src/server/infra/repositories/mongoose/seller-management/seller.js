const BaseRepository = ({ models, modelName }) => {
  const Model = models[modelName];

  const getById = (id) => {
    return Model.find({ id }).then(
      (entity) => entity,
      (error) => {
        throw error;
      }
    );
  };

  const save = (entity) => {
    return Model.find({ id: entity.id }).then(
      (entity) => entity,
      (error) => {
        throw error;
      }
    );
  };

  return Object.freeze({
    getById,
    save,
  });
};
export default BaseRepository;
