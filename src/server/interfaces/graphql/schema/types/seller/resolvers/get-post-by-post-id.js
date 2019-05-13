const getPostByPostId = (
  { postId },
  _,
  { services: { getPost }, serializers: { Id: idSerializer } }
) => getPost(idSerializer.serialize(postId));

export default getPostByPostId;
