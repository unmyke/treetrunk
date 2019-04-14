/* eslint-disable no-underscore-dangle */
import { ActionTypes } from 'mongorito';

export default () => {
  return (store) => (next) => (action) => {
    if (action.type === ActionTypes.SAVE) {
      const { model, modelClass } = store;
      const idPropName = `${modelClass.name.toLowerCase()}Id`;
      const id = model ? model[idPropName] : null;

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
