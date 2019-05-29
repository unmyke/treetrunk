import { fn } from 'jest';
import getPost from './get-post';
import { appointments as appointmentsMock } from '../mocks';

const getPostsListMock = fn(({ first, after, last, before, sort, filters }) => {
  const entities = appointmentsMock.map(({ postId }) => getPost(postId));
  return {
    entities,
    hasAfter: false,
    hasBefore: false,
  };
});
export default getPostsListMock;
