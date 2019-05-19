import { getIdPropNameByModel, getIdValue } from '../../_lib';

const BaseRepository = ({ Model, mapper, errors }) => {
  const mapToEntity = (model) => (model ? mapper.toEntity(model.get()) : null);
  const throwError = (error) => {
    throw error;
  };

  const idPropName = getIdPropNameByModel(Model);

  const findModel = (id) =>
    Model.where(idPropName)
      .equals(getIdValue(id))
      .findOne()
      .then((model) => {
        if (!model)
          throw errors.modelNotFound(
            `${Model.name} with ${idPropName}: "${getIdValue(id)}" not found`
          );
        return model;
      });

  const getList = ({ id = {}, ...query } = {}, where) =>
    Model.getList({ id: getIdValue(id), ...query, where }).then(
      ({ models, hasBefore, hasAfter }) => ({
        entities: models.map(mapToEntity),
        hasBefore,
        hasAfter,
      }),
      throwError
    );
  const getById = (id) => findModel(id).then(mapToEntity, throwError);
  const getByIds = (ids) =>
    Model.where(idPropName)
      .in(ids.map(getIdValue))
      .find()
      .then((models) => models.map(mapToEntity), throwError);
  const getOne = (query) => Model.findOne(query).then(mapToEntity, throwError);
  const save = (entity) => {
    const model = new Model(mapper.toDatabase(entity));
    return model.save().then(() => mapToEntity(model), throwError);
  };

  const destroy = (id) => {
    return Model.where(id)
      .equals(getIdValue(id))
      .remove();
  };

  return Object.freeze({
    getByIds,
    getList,
    getById,
    getOne,
    add: save,
    save,
    destroy,
  });
};
export default BaseRepository;
