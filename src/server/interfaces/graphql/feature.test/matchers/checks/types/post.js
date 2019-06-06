import withState from './with-state';
import withEntityTimestamp from './with-timestamp';

const checkPost = withState(
  withEntityTimestamp((post, mockPost) => {
    if (!post) {
      return {
        message: () => 'there is no post in response',
        pass: false,
      };
    }

    expect(post.id).toBe(mockPost.postId.value);
    expect(post.name).toBe(mockPost.name);
    expect(post.pieceRate).toBe(mockPost.pieceRate);
    mockPost.pieceRates.forEach(({ value, day: { value: day } }, idx) => {
      expect(post.pieceRates[idx]).toEqual({ value, day: day.getTime() });
    });

    return {
      message: 'response contains post',
      pass: true,
    };
  })
);
export default checkPost;
