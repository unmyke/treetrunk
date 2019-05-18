import uuidv4 from 'uuid/v4';

import container from '@container';
import request from '@infra/support/test/request';

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

const dateDTO = '2018-01-21T00:00:00.000+08:00';
const date = new Date(dateDTO);

const postProps = { name: 'Флорист', state: 'active' };

const pieceRatesDTO = [{ value: 1, date: dateDTO }];

let post;
let postDTO;
let persistedPost;

describe('API :: POST /api/posts/:id/piece_rates', () => {
  beforeEach(async () => {
    post = new Post(postProps);
    persistedPost = await postRepo.add(post);

    postDTO = {
      postId: post.postId.toString(),
      name: 'Флорист',
      state: 'active',
      pieceRate: 1,
      pieceRates: pieceRatesDTO,
    };
  });

  afterEach(() => {
    return postRepo.clear();
  });

  context('when post exists', () => {
    context('when props are correct', () => {
      test('should add piece rate and return 201', async () => {
        const { statusCode, body } = await request()
          .post(`/api/posts/${persistedPost.postId}/piece_rates`)
          .set('Accept', 'application/json')
          .send({
            value: 1,
            date: dateDTO,
          });

        expect(statusCode).toBe(201);

        expect(body).toEqual(postDTO);
      });
    });

    context('when props are not correct', () => {
      test('should not add piece rate and return 400', async () => {
        const { statusCode, body } = await request()
          .post(`/api/posts/${persistedPost.postId}/piece_rates`)
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
    context('when props are not passed', () => {
      test('should not add piece rate and return 400', async () => {
        const { statusCode, body } = await request()
          .post(`/api/posts/${persistedPost.postId}/piece_rates`)
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
    context('when piece rate already exists', () => {
      context('when piece rate at day already exists', () => {
        test('should not add piece rate and return 409', async () => {
          const postToUpdate = await postRepo.getById(persistedPost.postId);
          const day = new Day({ value: date });
          postToUpdate.addPieceRate(1, day);
          const updatedPost = await postRepo.save(postToUpdate);

          const { statusCode, body } = await request()
            .post(`/api/posts/${persistedPost.postId}/piece_rates`)
            .set('Accept', 'application/json')
            .send({
              value: 2,
              date: dateDTO,
            });

          expect(statusCode).toBe(409);
          expect(body.type).toBe('AlreadyExists');
          expect(body.details).toEqual({
            pieceRate: [
              `Piece rate at ${day.format('DD.MM.YYYY')} already exists`,
            ],
          });
        });
      });

      context('when value eqauls existing value at date', () => {
        test('should not add piece rate and return 409', async () => {
          const postToUpdate = await postRepo.getById(persistedPost.postId);
          const day = new Day({ value: date });
          postToUpdate.addPieceRate(1, day.startOfMonth());
          const updatedPost = await postRepo.save(postToUpdate);

          const { statusCode, body } = await request()
            .post(`/api/posts/${persistedPost.postId}/piece_rates`)
            .set('Accept', 'application/json')
            .send({
              value: 1,
              date: dateDTO,
            });

          expect(statusCode).toBe(409);
          expect(body.type).toBe('AlreadyExists');
          expect(body.details).toEqual({
            pieceRate: [
              `Piece rate value at ${day.format(
                'DD.MM.YYYY'
              )} already equals "1"`,
            ],
          });
        });
      });
    });
  });

  context('when post does not exists', () => {
    test('should not delete and return 404', async () => {
      const fakePostId = uuidv4();

      const { statusCode, body } = await request()
        .post(`/api/posts/${fakePostId}/piece_rates`)
        .set('Accept', 'application/json')
        .send({
          value: 1,
          date: date,
        });

      expect(statusCode).toBe(404);
      expect(body.type).toBe('NotFoundError');
      expect(body.details).toEqual({
        postId: [`Post with postId: "${fakePostId}" not found`],
      });
    });
  });

  // context('when post is appointed by existing sellers', () => {
  //   test('should not delete and return 409', async () => {
  //     const seller = new Seller({
  //       firstName: 'Firstname',
  //       middleName: 'Middlename',
  //       lastName: 'Lastname',
  //       phone: '00-00-00',
  //     });
  //     seller.addAppointment(persistedPost.postId, new Day());
  //     await sellerRepo.add(seller);

  //     const { statusCode, body } = await request()
  //       .delete(`/api/posts/${persistedPost.postId}`)
  //       .send();

  //     expect(statusCode).toBe(409);
  //     expect(body.type).toBe('NotAllowedError');
  //     expect(body.details).toEqual({
  //       post: [`There are sellers appointed to post "Флорист"`],
  //     });
  //   });
  // });
});
