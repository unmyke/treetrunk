import checkEntityTimestamp from './entity-timestamp';
import checkPost from './post';
import checkPostsList from './posts-list';
import checkSeniorityType from './seniority-type';

const checkSeller = async (
  seller,
  mockSeller,
  { mockPost, mockPostsList, mockSeniorityType }
) => {
  if (!seller) {
    return {
      message: () => `there is no seller in response`,
      pass: false,
    };
  }

  const { seller: mockSeller } = mocks;

  expect(seller.id).toBe(mockSeller.sellerId.value);
  expect(seller.firstName).toBe(mockSeller.firstName);
  expect(seller.middleName).toBe(mockSeller.middleName);
  expect(seller.lastName).toBe(mockSeller.lastName);
  expect(seller.phone).toBe(mockSeller.phone);
  if (mockSeller.dismissDay) {
    expect(seller.dismissDay).toBe(mockSeller.dismissDay.value.getTime());
  } else {
    expect(seller.dismissDay).toBeNull();
  }
  if (mockSeller.recruitDay) {
    expect(seller.recruitDay).toBe(mockSeller.recruitDay.value.getTime());
  } else {
    expect(seller.recruitDay).toBeNull();
  }
  expect(seller.postId).toBe(mockSeller.postId.value);
  mockSeller.postIds.forEach(({ value: postId }, idx) => {
    expect(seller.postIds[idx]).toBe(postId);
  });
  mockSeller.appointments.forEach(
    ({ postId: { value: postId }, day: { value: day } }, idx) => {
      expect({ postId, day: day.getTime() }).toEqual(seller.appointments[idx]);
    }
  );

  checkEntityTimestamp(seller, mockSeller);
  checkPost(seller.post, mockPost);
  checkPostsList(seller.posts, mockPosts);
  checkSeniorityType(seniorityType, mockSeniorityType);

  return {
    message: 'response contains seller',
    pass: true,
  };
};
export default checkSeller;
