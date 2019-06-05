import checkEntityTimestamp from './entity-timestamp';

const checkPost = checkEntityTimestamp((post, mockPost) => {
  if (!post) {
    return {
      message: () => 'there is no post in response',
      pass: false,
    };
  }

  expect(post.id).toBe(mockPost.postId.value);
  expect(post.name).toBe(mockPost.name);
  expect(post.pieceRate).toBe(mockPost.pieceRate);
  mockSeller.pieceRates.forEach(
    ({ postId: { value: postId }, day: { value: day } }, idx) => {
      expect({ postId, day: day.getTime() }).toEqual(post.pieceRates[idx]);
    }
  );

  return {
    message: 'response contains post',
    pass: true,
  };
});
export default checkPost;
