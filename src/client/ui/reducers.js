import { combineReducers } from 'redux';

const emptyReducer = (state = {}, action) => ({ ...state });

export const uiReducers = combineReducers({
  emptyReducer,
});
