/* eslint-disable no-underscore-dangle */
import { ActionTypes } from 'mongorito';

import getIdPropName from './get-id-prop-name';

const { SAVE, CREATE, UPDATE } = ActionTypes;

export default () => {
  return ({ modelClass, dispatch, getState }) => (next) => (action) => {
    if (action.type !== SAVE) {
      return next(action);
    }

    const idPropName = getIdPropName(modelClass);
    const { [idPropName]: id, ...modelFields } = getState().fields;

    return modelClass.findOne({ [idPropName]: id }).then((existingModel) => {
      if (existingModel) {
        const { _id, ...existingModelFields } = existingModel.get();
        const newModelFields = {
          ...existingModelFields,
          ...modelFields,
          _id,
        };

        return dispatch({ type: UPDATE, fields: newModelFields });
      }
      return dispatch({
        type: CREATE,
        fields: { ...modelFields, [idPropName]: id },
      });
    });
  };
};
