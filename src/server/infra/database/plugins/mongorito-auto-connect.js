import { ActionTypes } from 'mongorito';

const {
  REFRESH,
  SAVE,
  CREATE,
  UPDATE,
  REMOVE,
  INCREMENT,
  CREATE_INDEX,
  DROP_INDEX,
  LIST_INDEXES,
  CALL,
} = ActionTypes;

const databaseAccessActions = [
  REFRESH,
  SAVE,
  CREATE,
  UPDATE,
  REMOVE,
  INCREMENT,
  CREATE_INDEX,
  DROP_INDEX,
  LIST_INDEXES,
  CALL,
];
const STATE_DISCONNECT = 2;

export default () => {
  return ({ modelClass }) => (next) => (action) => {
    if (action.type in databaseAccessActions) {
      const { database } = modelClass;
      if (database.state === STATE_DISCONNECT) {
        console.log('database disconnected');
        return database.connect().then(() => next(action));
      }
    }
    return next(action);
  };
};
