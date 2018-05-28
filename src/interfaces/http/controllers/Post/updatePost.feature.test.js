import uuidv4 from 'uuid/v4';

import { container } from 'src/container';
import { request } from 'src/infra/support/test/request';

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

let post;
let postDTO;
let postToUpdate;

describe('API :: PUT /api/posts/:id', () => {
  beforeEach(async () => {
    post = new Post(postProps);
    post.setPieceRates(pieceRates);

    postDTO = {
      postId: post.postId.toString(),
      name: 'Флорист',
      state: 'active',
      pieceRate: 2,
      pieceRates: pieceRatesDTO,
    };

    postToUpdate = await postRepo.add(post);
  });

  afterEach(() => {
    return postRepo.clear();
  });

  context('when props are correct', () => {
    test('should update and return 202 with the updated post', async () => {
      const { statusCode, body } = await request()
        .put(`/api/posts/${postToUpdate.postId}`)
        .set('Accept', 'application/json')
        .send({ name: 'Старший флорист' });

      expect(statusCode).toBe(202);

      expect(body).toEqual({ ...postDTO, name: 'Старший флорист' });
    });

    context('when name is empty', () => {
      test('should not update and returns 400 with the validation error', async () => {
        const { statusCode, body } = await request()
          .put(`/api/posts/${postToUpdate.postId}`)
          .send({
            name: '',
          });

        expect(statusCode).toBe(400);
        expect(body.type).toBe('ValidationError');
        expect(body.details).toEqual({
          name: ["Name can't be blank"],
        });
      });
    });

    context('when send no props', () => {
      test('should not update and returns 400 with the validation error', async () => {
        const { statusCode, body } = await request()
          .put(`/api/posts/${postToUpdate.postId}`)
          .send();

        expect(statusCode).toBe(400);
        expect(body.type).toBe('ValidationError');
        expect(body.details).toEqual({
          name: ["Name can't be blank"],
        });
      });
    });
  });

  context('when post does not exist', () => {
    test('should not update and returns 400 with the not found message', async () => {
      const fakePostId = uuidv4();

      const { statusCode, body } = await request()
        .put(`/api/posts/${fakePostId}`)
        .send({
          name: 'Страший флорист',
        });

      expect(statusCode).toBe(404);
      expect(body.type).toBe('NotFoundError');
      expect(body.details).toEqual({
        postId: [`Post with postId: "${fakePostId}" not found`],
      });
    });
  });

  context('when post with updated name already exists', () => {
    test('should not update and returns 409 with the already exists message', async () => {
      const name = 'Старший флорист';
      const duplicatePostProps = { name };
      const duplicatePost = new Post(duplicatePostProps);
      duplicatePost.addPieceRate(3, day1);
      duplicatePost.addPieceRate(4, day2);
      await postRepo.add(duplicatePost);

      const { statusCode, body } = await request()
        .put(`/api/posts/${postToUpdate.postId}`)
        .send({
          name,
        });

      expect(statusCode).toBe(409);
      expect(body.type).toBe('AlreadyExists');
      expect(body.details).toEqual({
        name: ['Post with name: "Старший флорист" already exists'],
      });
    });
  });

  context('when post nothing to update', () => {
    test('should not update and returns 400 with the nothing to update message', async () => {
      const { statusCode, body } = await request()
        .put(`/api/posts/${postToUpdate.postId}`)
        .send({
          name: 'Флорист',
        });

      expect(statusCode).toBe(400);
      expect(body.type).toBe('NothingToUpdate');
      expect(body.details).toEqual({
        post: ['Post already has name "Флорист"'],
      });
    });
  });
});
