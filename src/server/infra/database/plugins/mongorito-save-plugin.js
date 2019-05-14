/* eslint-disable no-underscore-dangle */
import { ActionTypes } from 'mongorito';
import { getIdPropNameByModel } from '../../_lib';

const { SAVE, CREATE, UPDATE } = ActionTypes;

export default () => {
  return ({ model, modelClass, dispatch, getState }) => (next) => (action) => {
    if (action.type !== SAVE) {
      return next(action);
    }

    const idPropName = getIdPropNameByModel(modelClass);
    const { [idPropName]: id, ...modelFields } = getState().fields;

    return modelClass.findOne({ [idPropName]: id }).then((existingModel) => {
      if (existingModel) {
        const _id = existingModel.get('_id');
        const newModelFields = {
          ...modelFields,
          _id,
        };
        model.set({ _id });

        return dispatch({ type: UPDATE, fields: newModelFields });
      }
      return dispatch({
        type: CREATE,
        fields: { ...modelFields, [idPropName]: id },
      });
    });
  };
};
