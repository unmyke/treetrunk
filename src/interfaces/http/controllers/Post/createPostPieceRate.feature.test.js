import { container } from 'src/container';
import { request } from 'src/infra/support/test/request';
import { format } from 'date-fns';
import uuidv4 from 'uuid/v4';

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

const postProps = { name: 'Флорист', piecerate: 1 };

const pieceRates = [{ value: 1, date: format(pieceRateDate1) }];

let post;
let postDTO;
let persistedPost;

describe('API :: POST /api/posts/:id/piece_rates', () => {
  beforeEach(async () => {
    post = new Post(postProps);

    postDTO = {
      postId: post.postId.toString(),
      name: 'Флорист',
      pieceRate: 1,
      pieceRates,
    };

    persistedPost = await postRepo.add(post);
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
            date: pieceRateDate1,
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
            value: '',
            date: 'test',
          });

        expect(statusCode).toBe(400);
        expect(body.type).toBe('ValidationError');
        expect(body.details).toEqual({
          value: ["Value can't be blank"],
          date: ['Date "test" is not valid Date.'],
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
          date: pieceRateDate1,
        });

      expect(statusCode).toBe(404);
      expect(body.type).toBe('NotFoundError');
      expect(body.details).toEqual({
        postId: [`Post with postId: "${fakePostId}" not found.`],
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
