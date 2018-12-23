import { createSymbiote } from 'redux-symbiote';
import { initialFetching, createFetching } from 'symbiote-fetching';

const initialState = {
  seniorityTypes: [],
  fetching: initialFetching,
};

export const { actions, reducer } = createSymbiote(
  initialState,
  {
    fetch: createFetching('fetching'),
    set: (state, { seniorityTypes }) => ({
      ...state,
      seniorityTypes,
    }),
  },
  'seniorityTypes'
);
