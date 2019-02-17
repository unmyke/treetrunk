/* eslint-disable no-underscore-dangle */
import { ActionTypes } from 'mongorito';

const savePlugin = () => {
  return (store) => (next) => (action) => {
    if (action.type === ActionTypes.SAVE) {
      const { model, modelClass } = store;
      const idPropName = `${modelClass.name.toLowerCase()}Id`;
      const id = model ? model[idPropName] : null;
      console.log(store.getState());
      console.log(action);

      if (id) {
        modelClass.find({ [idPropName]: id }).then((existingModel) => {
          if (existingModel) {
            model.set({ _id: existingModel._id });
          }
        });
      }
    }

    return next(action);
  };
};

const embedToModel = (model, models) => {
  if (model.toEmbed) {
    model.toEmbed.forEach(({ path, modelName }) => {
      model.embeds(path, models[modelName]);
    });
  }
};

const modelLoader = (models, database) => {
  const modelsList = Object.values(models);

  return modelsList.map((model) => {
    embedToModel(model, models);
    model.use(savePlugin);
    return database.register(model);
  });
};

export default modelLoader;
