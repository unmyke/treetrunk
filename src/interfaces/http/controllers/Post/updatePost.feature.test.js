import { format } from 'date-fns';
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

const pieceRateDate1 = new Date('2018.01.21');
const pieceRateDate2 = new Date('2018.02.21');
const pieceRateDay1 = new Day({ value: pieceRateDate1 });
const pieceRateDay2 = new Day({ value: pieceRateDate2 });

const postProps = { name: 'Флорист' };

let post;
let postDTO;
let postToUpdate;

describe('API :: PUT /api/posts/:id', () => {
  beforeEach(async () => {
    post = new Post(postProps);
    post.addPieceRate(1, pieceRateDay1);
    post.addPieceRate(2, pieceRateDay2);

    postDTO = {
      postId: post.postId.toString(),
      name: 'Флорист',
      pieceRate: 2,
      pieceRates: [
        { value: 1, date: format(pieceRateDate1) },
        { value: 2, date: format(pieceRateDate2) },
      ],
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
        postId: [`Post with postId: "${fakePostId}" not found.`],
      });
    });
  });

  context('when post with updated name already exists', () => {
    test('should not update and returns 400 with the already exists message', async () => {
      const name = 'Старший флорист';
      const duplicatePostProps = { name };
      const duplicatePost = new Post(duplicatePostProps);
      duplicatePost.addPieceRate(3, pieceRateDay1);
      duplicatePost.addPieceRate(4, pieceRateDay2);
      await postRepo.add(duplicatePost);

      const { statusCode, body } = await request()
        .put(`/api/posts/${postToUpdate.postId}`)
        .send({
          name,
        });

      expect(statusCode).toBe(400);
      expect(body.type).toBe('AlreadyExists');
      expect(body.details).toEqual({
        name: ['Post with name: "Старший флорист" already exists.'],
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
        post: ['Post already has name "Флорист".'],
      });
    });
  });
});
