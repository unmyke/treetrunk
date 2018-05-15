import { container } from 'src/container';
import { request } from 'src/infra/support/test/request';
import uuidv4 from 'uuid/v4';

const {
  subdomains: {
    SellerManagement: {
      entities: { Post },
    },
  },
  commonTypes: { Day },
  repositories: {
    SellerManagement: { Post: postRepo },
  },
} = container;

const pieceRateDate1 = new Date('2018.01.21');
const pieceRateDate2 = new Date('2018.02.21');
const pieceRateDay1 = new Day({ value: pieceRateDate1 });
const pieceRateDay2 = new Day({ value: pieceRateDate2 });

const postProps = { name: 'Флорист' };

const pieceRates = [
  { value: 1, date: pieceRateDate1 },
  { value: 2, date: pieceRateDate2 },
];

let post;
let postDTO;
let postToDelete;

describe('API :: DELETE /api/posts/:id', () => {
  beforeEach(async () => {
    post = new Post(postProps);
    post.setPieceRates(pieceRates);

    postDTO = {
      postId: post.postId.toString(),
      name: 'Флорист',
      currentPieceRate: 2,
      pieceRates,
    };

    postToDelete = await postRepo.add(post);
  });

  afterEach(() => {
    return postRepo.clear();
  });

  context('when post exists', () => {
    test('should delete and return 202', async () => {
      const { statusCode, body } = await request()
        .delete(`/api/posts/${postToDelete.postId}`)
        .send();

      expect(statusCode).toBe(202);

      expect(body).toEqual({});
    });
  });

  context('when post does not exists', () => {
    test('should not delete and return 404', async () => {
      const fakePostId = uuidv4();

      const { statusCode, body } = await request()
        .delete(`/api/posts/${fakePostId}`)
        .send();

      expect(statusCode).toBe(404);
      expect(body.type).toBe('NotFoundError');
      expect(body.details).toEqual({
        postId: [`Post with postId: "${fakePostId}" not found.`],
      });
    });
  });
});
