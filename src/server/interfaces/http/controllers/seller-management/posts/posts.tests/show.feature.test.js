import uuidv4 from 'uuid/v4';

import { container } from '@container';
import { request } from '@infra/support/test/request';

const {
  subdomains: {
    SellerManagement: {
      entities: { Post },
    },
  },
  commonTypes: { Day, PostId },
  repositories: {
    SellerManagement: { Post: postRepo },
  },
} = container;

const quitPostId = new PostId();
PostId.quitPostId = quitPostId;

const dateDTO1 = '2018-01-21T00:00:00.000+08:00';
const dateDTO2 = '2018-02-21T00:00:00.000+08:00';
const pieceRatesDTO = [
  { value: 1, date: dateDTO1 },
  { value: 2, date: dateDTO2 },
];

const date1 = new Date(dateDTO1);
const date2 = new Date(dateDTO2);

const postProps = { name: 'Флорист', state: 'active' };
const day1 = new Day({ value: date1 });
const day2 = new Day({ value: date2 });
const pieceRates = [{ value: 1, day: day1 }, { value: 2, day: day2 }];

const post = new Post(postProps);
post.setPieceRates(pieceRates);

const postDTO = {
  postId: post.postId.toString(),
  name: 'Флорист',
  state: 'active',
  pieceRate: 2,
  pieceRates: pieceRatesDTO,
};

describe('API :: GET /api/posts/:id', () => {
  beforeEach(() => {
    return postRepo.add(post);
  });

  afterEach(() => {
    return postRepo.clear();
  });

  context('when post exists', () => {
    test('updates and returns 202 with the updated post', async () => {
      const { statusCode, body } = await request().get(
        `/api/posts/${post.postId}`
      );

      expect(statusCode).toBe(200);

      expect(body).toEqual(postDTO);
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
          postId: [`Post with postId: "${uuid}" not found`],
        },
      });
    });
  });
});
