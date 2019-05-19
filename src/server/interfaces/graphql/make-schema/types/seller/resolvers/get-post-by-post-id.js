const getPostByPostId = (
  { postId },
  _,
  {
    dataSources: {
      services: { getPost },
    },
    serializers: { Post: postSerializer },
  }
) => getPost(postId).then(postSerializer);

export default getPostByPostId;
