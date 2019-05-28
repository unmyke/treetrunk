const postMock = (id, { name, createdAt } = {}) => ({
  postId: id,
  name: name || `Name ${id}`,
  createdAt: new Date(createdAt || '2018-01-01'),
});
export default postMock;
