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

// test request body
const validReqBody = {
  name: 'Флорист',
};
const invalidNameReqBody = {
  name: '',
};

const emptyReqBody = {};

// test DTO
const postDTO = {
  name: validReqBody.name,
  pieceRates: [],
};

describe('API :: POST /api/posts', () => {
  beforeEach(() => {
    return postRepo.clear();
  });

  context('when passed valid and consistent props', () => {
    context('when post does not exists', () => {
      test('should return success with array with one post', async () => {
        const { statusCode, body } = await request()
          .post('/api/posts')
          .set('Accept', 'application/json')
          .send(validReqBody);

        expect(statusCode).toBe(201);

        expect(body.name).toBe('Флорист');
        expect(body).toHaveProperty('postId');
      });
    });
    context('when post exists', () => {
      test('should return 409 with array of errors', async () => {
        const post = new Post({ name: 'Флорист' });
        await postRepo.add(post);

        const { statusCode, body } = await request()
          .post('/api/posts')
          .set('Accept', 'application/json')
          .send({ name: 'Флорист' });

        expect(statusCode).toBe(409);
        expect(body.type).toBe('AlreadyExists');
        expect(body.details).toEqual({
          name: ['Post with name: "Флорист" already exists'],
        });
      });
    });
  });

  context('when props are incorrect', () => {
    context('when props are invalid', () => {
      test('should return 400 with array of errors', async () => {
        const { statusCode, body } = await request()
          .post('/api/posts')
          .set('Accept', 'application/json')
          .send({
            name: '',
          });

        expect(statusCode).toBe(400);
        expect(body.type).toBe('ValidationError');
        expect(body.details).toEqual({ name: ["Name can't be blank"] });
      });
    });

    context('when there are no props', () => {
      test('should return 400 with array of errors', async () => {
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
});
