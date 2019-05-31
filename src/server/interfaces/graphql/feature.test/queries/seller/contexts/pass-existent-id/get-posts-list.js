import { getPost } from '../../../../mocks/services';

const getPostsListMock = ({
  filter: {
    fields: [{ value: postIds }],
  },
}) => {
  const entities = postIds.map((postId) => getPost(postId));
  return {
    entities,
    hasAfter: false,
    hasBefore: false,
  };
};

export default getPostsListMock;
