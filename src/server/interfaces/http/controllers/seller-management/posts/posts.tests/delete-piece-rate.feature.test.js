import uuidv4 from 'uuid/v4';

import container from '@container';
import request from '@infra/tests/request';

const {
  entities: {
    SellerManagement: {
      entities: { Post, Seller },
    },
  },
  commonTypes: { Day },
  repositories: {
    SellerManagement: { Post: postRepo, Seller: sellerRepo },
  },
} = container;

const dateDTO1 = '2018-01-21T00:00:00.000+08:00';
const dateDTO2 = '2018-02-21T00:00:00.000+08:00';
const pieceRatesDTO = [
  { value: 1, date: dateDTO1 },
  { value: 2, date: dateDTO2 },
];
const afterDeletePieceRatesDTO = [{ value: 2, date: dateDTO2 }];

const date1 = new Date(dateDTO1);
const date2 = new Date(dateDTO2);

const postProps = { name: 'Флорист', state: 'active' };
const day1 = new Day({ value: date1 });
const day2 = new Day({ value: date2 });
const pieceRates = [{ value: 1, day: day1 }, { value: 2, day: day2 }];
const afterDeletePieceRates = [{ value: 2, day: day2 }];

describe('API :: DELETE /api/posts/:id/piece_rates', () => {
  let post;
  let postDTO;
  let persistedPost;

  beforeEach(async () => {
    post = new Post(postProps);

    postDTO = {
      postId: post.postId.toString(),
      name: 'Флорист',
      state: 'active',
      pieceRate: 2,
      pieceRates: afterDeletePieceRatesDTO,
    };

    post.setPieceRates(pieceRates);

    persistedPost = await postRepo.add(post);
  });

  afterEach(() => {
    return postRepo.clear();
  });

  context('when post exists', () => {
    context('when props are correct', () => {
      test('should delete piece rate and return 202 with updated post', async () => {
        const { statusCode, body } = await request()
          .delete(`/api/posts/${persistedPost.postId}/piece_rates`)
          .set('Accept', 'application/json')
          .send({
            value: 1,
            date: dateDTO1,
          });

        expect(statusCode).toBe(202);

        expect(body).toEqual(postDTO);
      });
    });

    context('when props are not correct', () => {
      context('when piece rate with props not exists', () => {
        test('should not delete piece rate and return 400 with the not found error message', async () => {
          const { statusCode, body } = await request()
            .delete(`/api/posts/${persistedPost.postId}/piece_rates`)
            .set('Accept', 'application/json')
            .send({
              value: 2,
              date: dateDTO1,
            });

          expect(statusCode).toBe(404);
          expect(body.type).toBe('NotFoundError');
          expect(body.details).toEqual({
            pieceRate: [
              `Piece rate with value 2 at ${day1.format(
                'DD.MM.YYYY'
              )} not found`,
            ],
          });
        });
      });
      context('when props are not correct', () => {
        test('should not delete piece rate and return 400 with the validation error message', async () => {
          const { statusCode, body } = await request()
            .delete(`/api/posts/${persistedPost.postId}/piece_rates`)
            .set('Accept', 'application/json')
            .send({});

          expect(statusCode).toBe(400);
          expect(body.type).toBe('ValidationError');
          expect(body.details).toEqual({
            pieceRate: [
              "Piece rate value can't be blank",
              "Piece rate date can't be blank",
            ],
          });
        });
      });
      context('when props are not passed', () => {
        test('should not delete piece rate and return 400 with the validation error message', async () => {
          const { statusCode, body } = await request()
            .delete(`/api/posts/${persistedPost.postId}/piece_rates`)
            .set('Accept', 'application/json')
            .send({
              value: 'test',
              date: 'test',
            });

          expect(statusCode).toBe(400);
          expect(body.type).toBe('ValidationError');
          expect(body.details).toEqual({
            pieceRate: [
              'Piece rate value "test" is not a valid number',
              'Piece rate date "test" is not a valid date',
            ],
          });
        });
      });
    });
  });

  context('when post does not exists', () => {
    test('should not delete and return 404 with the nothing to update message', async () => {
      const fakePostId = uuidv4();

      const { statusCode, body } = await request()
        .delete(`/api/posts/${fakePostId}/piece_rates`)
        .set('Accept', 'application/json')
        .send({
          value: 1,
          date: dateDTO1,
        });

      expect(statusCode).toBe(404);
      expect(body.type).toBe('NotFoundError');
      expect(body.details).toEqual({
        postId: [`Post with postId: "${fakePostId}" not found`],
      });
    });
  });
});
