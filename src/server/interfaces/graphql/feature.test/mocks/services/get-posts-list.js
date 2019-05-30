import uuidv4 from 'uuid/v4';
import getPost from './get-post';

const getPostsListMock = ({ first, after, last, before, sort, filters }) => {
  const entities = appointmentsMock.map(({ postId }) => getPost(postId));
  return {
    entities,
    hasAfter: false,
    hasBefore: false,
  };
};
export default getPostsListMock;
