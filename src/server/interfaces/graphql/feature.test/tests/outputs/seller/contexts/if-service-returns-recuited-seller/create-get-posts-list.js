const createGetPostsListMock = ({ getPost }) => ({
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

export default createGetPostsListMock;
