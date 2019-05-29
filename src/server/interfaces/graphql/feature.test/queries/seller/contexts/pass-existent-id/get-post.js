import { fn } from 'jest';
import container from '@container';
import { post as postMock, pieceRates as pieceRatesMock } from '../mocks';

const {
  entities: {
    SellerManagement: { Post },
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

  pieceRatesMock.forEach(({ value, day }) => {
    post.addPieceRate(value, new Day({ value: day }));
  });

  return Promise.resolve(post);
});
export default getPostMock;
