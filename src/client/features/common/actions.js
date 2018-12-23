import { createActions } from 'redux-actions';

export const actions = createActions({
  set: (entities) => ({ entities }),
});
