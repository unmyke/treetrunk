import { fn } from 'jest';
import container from '@container';
import { post as postMock, appointments as appointmentsMock } from '../mocks';

const {
  entities: {
    PostManagement: { Post },
  },
  commonTypes: { PostId },
} = container;

const getPostMock = fn((id) => {
  const { postId, name, createdAt } = postMock(id);
  const post = new Post({
    postId: new PostId({ value: postId }),
    name,
    createdAt,
  });

  pieceRates.forEach();

  post.addApointment(
    new PostId({ value: appointmentsMock[0].postId }),
    new Day({ value: appointmentsMock[0].day })
  );

  return Promise.resolve(post);
});
export default getPostMock;
