const getPostByPostIdResolver = () => (
  { postId },
  _,
  {
    dataSources: {
      services: { getPost },
    },
    serializers: { Post: postSerializer },
  }
) => (postId ? getPost(postId).then(postSerializer) : null);

export default getPostByPostIdResolver;
