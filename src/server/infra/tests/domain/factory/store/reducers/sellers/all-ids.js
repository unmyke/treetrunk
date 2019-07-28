import { remove } from 'lodash';
import { handleActions } from 'redux-actions';
import { createSeller, deleteSeller } from './actions';

const allIds = handleActions({
  [createSeller]: (state, { payload: { seller } }) => [...state, seller.id],
  [deleteSeller]: (state, { payload: { id } }) =>
    remove(state, (currentId) => currentId === id),
});

export default allIds;
