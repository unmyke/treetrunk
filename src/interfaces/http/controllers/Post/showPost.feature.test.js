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
const post = new Post(postProps);

post.addPieceRate(1, pieceRateDay1);
post.addPieceRate(2, pieceRateDay2);

const postDTO = {
  postId: post.postId.toString(),
  name: 'Флорист',
  pieceRate: 2,
  pieceRates: [
    { value: 1, date: '21.01.2018' },
    { value: 2, date: '21.02.2018' },
  ],
};

let postToUpdate;

describe('API :: GET /api/posts/:id', () => {
  beforeEach(() => {
    return postRepo.add(post);
  });

  afterEach(() => {
    return postRepo.clear();
  });

  context('when post exists', () => {
    context('when sent data is ok', () => {
      test('updates and returns 202 with the updated post', async () => {
        const { statusCode, body } = await request().get(
          `/api/posts/${post.postId}`
        );

        expect(statusCode).toBe(200);

        expect(body).toEqual(postDTO);
      });
    });
  });

  context('when seller does not exist', () => {
    test('returns a not found error and status 404', async () => {
      const uuid = uuidv4();
      const { statusCode, body } = await request().get(`/api/posts/${uuid}`);

      expect(statusCode).toBe(404);
      expect(body).toEqual({
        type: 'NotFoundError',
        details: {
          postId: [`Post with postId: "${uuid}" not found.`],
        },
      });
    });
  });
});
