import { createSymbiote } from 'redux-symbiote';
import { initialFetching, createFetching } from 'symbiote-fetching';

const initialState = {
  posts: [],
  fetching: initialFetching,
};

export const { actions, reducer } = createSymbiote(
  initialState,
  {
    fetch: createFetching('fetching'),
    set: (state, { posts }) => ({
      ...state,
      posts,
    }),
  },
  'posts'
);
