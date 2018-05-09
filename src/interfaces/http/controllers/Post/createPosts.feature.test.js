import { container } from 'src/container';
import { request } from 'src/infra/support/test/request';

const {
  repositories: { Post: postRepo },
} = container;

describe('API :: POST /api/posts', () => {
  context('when props are correct', () => {
    beforeEach(() => {
      return postRepo.clear();
    });

    test('should return success with array with one post', async () => {
      const { statusCode, body } = await request()
        .post('/api/posts')
        .set('Accept', 'application/json')
        .send({ name: 'Флорист' });

      expect(statusCode).toBe(201);

      expect(body.name).toBe('Флорист');
      expect(body).toHaveProperty('postId');
    });
  });

  context('when there are no posts', () => {
    test('should return BD_REQUEST with array of errors', async () => {
      const { statusCode, body } = await request()
        .post('/api/posts')
        .set('Accept', 'application/json')
        .send();

      expect(statusCode).toBe(400);
      expect(body.type).toBe('ValidationError');
      expect(body.details).toEqual({ name: ["Name can't be blank"] });
    });
  });
});
