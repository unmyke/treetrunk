import exec from '../exec';

const BaseRepository = ({ Model, mapper, database }) => {
  const idPropName = `${Model.name.toLowerCase()}Id`;

  const find = (query) => {
    return exec(database, () =>
      Model.find(query).then(
        (entity) => mapper.toEntity(entity),
        (error) => {
          throw error;
        }
      )
    );
  };

  const getById = (id) => find({ [idPropName]: id });

  const getOne = (query) => {
    return exec(database, () =>
      Model.findOne(query).then(
        (entity) => (entity ? mapper.toEntity(entity) : null),
        (error) => {
          throw error;
        }
      )
    );
  };

  const save = (entity) => {
    const modelProps = mapper.toDatabase(entity);
    const model = new Model(modelProps);
    console.log(model.get());
    return exec(database, () =>
      model.save().then(
        (action) => {
          console.log(action);
          const entity = mapper.toEntity(model.get());
          return entity;
        },
        (error) => {
          throw error;
        }
      )
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
