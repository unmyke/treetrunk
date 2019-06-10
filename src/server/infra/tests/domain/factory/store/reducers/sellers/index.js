import { combineReducers } from 'redux';
import byId from './by-id';
import allIds from './all-ids';

const sellers = combineReducers({
  byId,
  allIds,
});
export default sellers;
