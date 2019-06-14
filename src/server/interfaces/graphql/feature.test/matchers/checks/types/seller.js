import withTimestamp from './with-timestamp';
import withState from './with-state';
import checkPost from './post';
import { posts as checkPostConnection } from '../connections';
import checkSeniorityType from './seniority-type';

const checkSeller = withState(
  withTimestamp(
    (seller, mockSeller, { mockPosts, mockPostsList, mockSeniorityType }) => {
      if (!seller) {
        return {
          message: () => `there is no seller in response`,
          pass: false,
        };
      }

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
      if (mockSeller.postId) {
        expect(seller.postId).toBe(mockSeller.postId.value);
        checkPost(seller.post, mockPosts[0]);
      } else {
        expect(seller.postId).toBeNull();
      }
      mockSeller.postIds.forEach(({ value: postId }, idx) => {
        expect(seller.postIds[idx]).toBe(postId);
      });
      mockSeller.appointments.forEach(
        ({ postId: { value: mockPostId }, day: { value: mockDay } }, idx) => {
          const { postId, post, day } = seller.appointments[idx];
          expect(postId).toBe(mockPostId);
          expect(day).toBe(mockDay.getTime());
          checkPost(post, mockPostsList.entities[idx]);
        }
      );
      checkPostConnection(seller.posts, mockPostsList);

      if (mockSeller.seniority) {
        expect(seller.seniority).toBe(mockSeller.seniority);
        checkSeniorityType(seller.seniorityType, mockSeniorityType);
      } else {
        expect(seller.seniority).toBeNull();
        expect(seller.seniorityType).toBeNull();
      }

      return {
        message: 'response contains seller',
        pass: true,
      };
    }
  )
);
export default checkSeller;