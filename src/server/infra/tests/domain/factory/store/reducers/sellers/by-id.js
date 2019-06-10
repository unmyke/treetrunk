import { omit, update } from 'lodash';
import { handleActions } from 'redux-actions';
import { createSeller, deleteSeller, updateSeller } from './actions';

const byId = handleActions({
  [createSeller]: (state, { payload: { seller } }) => ({
    ...state,
    [seller.id]: seller,
  }),
  [deleteSeller]: (state, { payload: { id } }) => omit(state, id),
  [updateSeller]: (state, { payload: { seller } }) =>
    update(state, seller.id, seller),
});

export default byId;
