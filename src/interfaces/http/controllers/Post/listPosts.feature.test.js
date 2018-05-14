import { container } from 'src/container';
import { request } from 'src/infra/support/test/request';

const {
  subdomains: {
    SellerManagement: {
      entities: { Post },
    },
  },
  repositories: {
    SellerManagement: { Post: postRepo },
  },
} = container;

const postProps1 = { name: 'Флорист' };
const postProps2 = { name: 'Старший флорист' };
const post1 = new Post(postProps1);
const post2 = new Post(postProps2);

describe('API :: GET /api/posts', () => {
  context('when there are posts', () => {
    beforeEach(() => {
      return Promise.all([postRepo.add(post1), postRepo.add(post2)]);
    });

    afterEach(() => {
      return postRepo.clear();
    });

    test('should return success with array of posts', async () => {
      const { statusCode, body } = await request().get('/api/posts');

      expect(statusCode).toBe(200);

      expect(body).toHaveLength(2);

      expect(body[0].name).toBe('Флорист');
      expect(body[0].postId).toBe(post1.postId.toString());

      expect(body[1].name).toBe('Старший флорист');
      expect(body[1].postId).toBe(post2.postId.toString());
    });

    // context('when props is passed', () => {
    //   test('should return success with array with one post', async () => {
    //     const { statusCode, body } = await request().get(
    //       '/api/posts?name=Флорист'
    //     );

    //     expect(statusCode).toBe(200);

    //     expect(body).toHaveLength(1);

    //     expect(body[0].name).toBe('Флорист');
    //     expect(body[0]).toHaveProperty('postId');
    //   });
    // });
  });

  context('when there are no posts', () => {
    test('return success with empty array', async () => {
      const { statusCode, body } = await request().get('/api/posts');

      expect(statusCode).toBe(200);
      expect(body).toHaveLength(0);
    });
  });
});
