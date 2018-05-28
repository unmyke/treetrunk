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

const dateDTO1 = '2018-01-21T00:00:00.000+08:00';
const dateDTO2 = '2018-02-21T00:00:00.000+08:00';
const pieceRatesDTO = [{ value: 1, date: dateDTO1 }];
const updatedPieceRatesDTO = [{ value: 2, date: dateDTO2 }];

const date1 = new Date(dateDTO1);
const date2 = new Date(dateDTO2);

const postProps = { name: 'Флорист', state: 'active' };
const day1 = new Day({ value: date1 });
const day2 = new Day({ value: date2 });
const pieceRates = [{ value: 1, day: day1 }];
const updatedPieceRates = [{ value: 2, day: day2 }];

describe('API :: POST /api/posts/:id/piece_rates', () => {
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
      pieceRates: updatedPieceRatesDTO,
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
              date: dateDTO1,
            },
            updatedPieceRate: {
              value: 2,
              date: dateDTO2,
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
                date: dateDTO1,
              },
              updatedPieceRate: {
                value: 1,
                date: dateDTO1,
              },
            });

          expect(statusCode).toBe(400);
          expect(body.type).toBe('NothingToUpdate');
          expect(body.details).toEqual({
            pieceRate: [
              'Updated piece rate at 21.01.2018 for post "Флорист" already equlas 1%',
            ],
          });
        });
      });

      context('when piece rate already exists', () => {
        let dateDTO3;
        beforeEach(async () => {
          dateDTO3 = '2018-03-21T00:00:00.000+08:00';
          post.addPieceRate(2, day2);
          await postRepo.save(post);
        });

        context('when piece rate at update day already exists', () => {
          test('should not edit piece rate and return 409 with the nothing to update error message', async () => {
            const { statusCode, body } = await request()
              .put(`/api/posts/${persistedPost.postId}/piece_rates`)
              .set('Accept', 'application/json')
              .send({
                pieceRate: {
                  value: 1,
                  date: dateDTO1,
                },
                updatedPieceRate: {
                  value: 3,
                  date: dateDTO2,
                },
              });

            expect(statusCode).toBe(409);
            expect(body.type).toBe('AlreadyExists');
            expect(body.details).toEqual({
              pieceRate: ['Piece rate at 21.02.2018 already exists'],
            });
          });
        });
        context(
          'when update value equals existing value at update date',
          () => {
            test('should not edit piece rate and return 409 with the nothing to update error message', async () => {
              const { statusCode, body } = await request()
                .put(`/api/posts/${persistedPost.postId}/piece_rates`)
                .set('Accept', 'application/json')
                .send({
                  pieceRate: {
                    value: 1,
                    date: dateDTO1,
                  },
                  updatedPieceRate: {
                    value: 2,
                    date: dateDTO3,
                  },
                });

              expect(statusCode).toBe(409);
              expect(body.type).toBe('AlreadyExists');
              expect(body.details).toEqual({
                pieceRate: [
                  'Piece rate value at 21.03.2018 already equals "2"',
                ],
              });
            });
          }
        );
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
      context('when original piece rate not exists', () => {
        test('should not edit piece rate and return 404 with the not found error message', async () => {
          const { statusCode, body } = await request()
            .put(`/api/posts/${persistedPost.postId}/piece_rates`)
            .set('Accept', 'application/json')
            .send({
              pieceRate: {
                value: 2,
                date: dateDTO1,
              },
              updatedPieceRate: {
                value: 2,
                date: dateDTO2,
              },
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
            date: date1,
          },
          updatedPieceRate: {
            value: 2,
            date: date2,
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
