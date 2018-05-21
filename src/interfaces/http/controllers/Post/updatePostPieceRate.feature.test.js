import { format } from 'date-fns';
import uuidv4 from 'uuid/v4';

import { container } from 'src/container';
import { request } from 'src/infra/support/test/request';

const {
  subdomains: {
    SellerManagement: {
      entities: { Post, Seller },
    },
  },
  commonTypes: { Day },
  repositories: {
    SellerManagement: { Post: postRepo, Seller: sellerRepo },
  },
} = container;

const pieceRateDate1 = new Date('2018-01-20T16:00:00.000Z');
const pieceRateDay1 = new Day({ value: pieceRateDate1 });
const pieceRateDate2 = new Date('2018-02-20T16:00:00.000Z');
const pieceRateDay2 = new Day({ value: pieceRateDate2 });

const postProps = { name: 'Флорист' };

const pieceRates = [{ value: 1, date: format(pieceRateDate1) }];
const updatedPieceRates = [{ value: 2, date: format(pieceRateDate2) }];

describe('API :: POST /api/posts/:id/piece_rates', () => {
  let post;
  let postDTO;
  let persistedPost;

  beforeEach(async () => {
    post = new Post(postProps);

    postDTO = {
      postId: post.postId.toString(),
      name: 'Флорист',
      pieceRate: 2,
      pieceRates: updatedPieceRates,
    };

    post.setPieceRates(pieceRates);

    persistedPost = await postRepo.add(post);
  });

  afterEach(() => {
    return postRepo.clear();
  });

  context('when post exists', () => {
    context('when props are correct', () => {
      test('should edit piece rate and return 202 with updated post', async () => {
        const { statusCode, body } = await request()
          .put(`/api/posts/${persistedPost.postId}/piece_rates`)
          .set('Accept', 'application/json')
          .send({
            pieceRate: {
              value: 1,
              date: pieceRateDate1,
            },
            updatedPieceRate: {
              value: 2,
              date: pieceRateDate2,
            },
          });

        expect(statusCode).toBe(202);

        expect(body).toEqual(postDTO);
      });
    });

    context('when props are not correct', () => {
      context('when original and updated piece rate props are same', () => {
        test('should not edit piece rate and return 400 with the nothing to update error message', async () => {
          const { statusCode, body } = await request()
            .put(`/api/posts/${persistedPost.postId}/piece_rates`)
            .set('Accept', 'application/json')
            .send({
              pieceRate: {
                value: 1,
                date: pieceRateDate1,
              },
              updatedPieceRate: {
                value: 1,
                date: pieceRateDate1,
              },
            });

          expect(statusCode).toBe(400);
          expect(body.type).toBe('NothingToUpdate');
          expect(body.details).toEqual({
            post: [
              'Updated piece rate at 21.01.2018 for post "Флорист" already equlas 1%',
            ],
          });
        });
      });
      context(
        'when original and updated piece rate props are not passed',
        () => {
          test('should not edit piece rate and return 400 with the validation error message', async () => {
            const { statusCode, body } = await request()
              .put(`/api/posts/${persistedPost.postId}/piece_rates`)
              .set('Accept', 'application/json')
              .send({});

            expect(statusCode).toBe(400);
            expect(body.type).toBe('ValidationError');
            expect(body.details).toEqual({
              pieceRate: ["Piece rate can't be blank"],
              updatedPieceRate: ["Updated piece rate can't be blank"],
            });
          });
        }
      );
      context(
        'when values of original and updated piece rate props are not correct',
        () => {
          test('should not edit piece rate and return 400 with the validation error message', async () => {
            const { statusCode, body } = await request()
              .put(`/api/posts/${persistedPost.postId}/piece_rates`)
              .set('Accept', 'application/json')
              .send({
                pieceRate: {
                  value: 'value',
                  date: 'pieceRateDate1',
                },
                updatedPieceRate: {
                  value: '',
                  date: '',
                },
              });

            expect(statusCode).toBe(400);
            expect(body.type).toBe('ValidationError');
            expect(body.details).toEqual({
              pieceRate: [
                'Piece rate value "value" is not a valid number',
                'Piece rate date "pieceRateDate1" is not a valid date',
              ],
              updatedPieceRate: [
                "Updated piece rate value can't be blank",
                "Updated piece rate date can't be blank",
              ],
            });
          });
        }
      );
    });
  });

  context('when post does not exists', () => {
    test('should not delete and return 404 with the nothing to update message', async () => {
      const fakePostId = uuidv4();

      const { statusCode, body } = await request()
        .put(`/api/posts/${fakePostId}/piece_rates`)
        .set('Accept', 'application/json')
        .send({
          pieceRate: {
            value: 1,
            date: pieceRateDate1,
          },
          updatedPieceRate: {
            value: 2,
            date: pieceRateDate2,
          },
        });

      expect(statusCode).toBe(404);
      expect(body.type).toBe('NotFoundError');
      expect(body.details).toEqual({
        postId: [`Post with postId: "${fakePostId}" not found`],
      });
    });
  });
});
