import checkEntityTimestamp from './entity-timestamp';

const checkPost = async (post, mockPost) => {
  if (!post) {
    return {
      message: () => `there is no post in response`,
      pass: false,
    };
  }

  const { post: mockPost } = mocks;

  expect(post.id).toBe(mockPost.sellerId.value);
  expect(post.firstName).toBe(mockPost.firstName);
  expect(post.middleName).toBe(mockPost.middleName);
  expect(post.lastName).toBe(mockPost.lastName);
  expect(post.phone).toBe(mockPost.phone);
  if (mockPost.dismissDay) {
    expect(post.dismissDay).toBe(mockPost.dismissDay.value.getTime());
  } else {
    expect(post.dismissDay).toBeNull();
  }
  if (mockPost.recruitDay) {
    expect(post.recruitDay).toBe(mockPost.recruitDay.value.getTime());
  } else {
    expect(post.recruitDay).toBeNull();
  }
  expect(post.postId).toBe(mockPost.postId.value);
  mockPost.postIds.forEach(({ value: postId }, idx) => {
    expect(post.postIds[idx]).toBe(postId);
  });
  checkEntityTimestamp(post, mockPost);
  checkPost(post.post, mockPost);
  checkPostsList(post.posts, mockPosts);
  checkSeniorityType(seniorityType, mockSeniorityType);

  return {
    message: 'response contains post',
    pass: true,
  };
};
export default checkPost;
