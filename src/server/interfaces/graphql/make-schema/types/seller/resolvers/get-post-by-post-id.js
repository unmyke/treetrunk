const getPostByPostId = (
  { postId },
  _,
  { services: { getPost }, serializers: { Post: postSerializer } }
) => getPost(postId).then(postSerializer);

export default getPostByPostId;
