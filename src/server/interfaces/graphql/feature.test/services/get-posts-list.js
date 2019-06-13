import getPost from './get-post';

const getPostsListMock = ({}) => {
  const entities = appointmentsMock.map(({ postId }) => getPost(postId));
  return {
    entities,
    hasAfter: false,
    hasBefore: false,
  };
};
export default getPostsListMock;
