import { createStore } from 'redux';
import * as reducers from './reducers';

const store = createStore(reducers);
export default store;
