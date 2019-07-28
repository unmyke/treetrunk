import uuidv4 from 'uuid/v4';

import container from '@container';
import request from '@infra/tests/request';

const {
  entities: {
    SellerManagement: {
      entities: { Post, Seller },
    },
  },
  commonTypes: { Day, PostId },
  repositories: {
    SellerManagement: { Post: postRepo, Seller: sellerRepo },
  },
} = container;

PostId.quitPostId = new PostId();

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
let postToDelete;

describe('API :: DELETE /api/posts/:id', () => {
  beforeEach(async () => {
    post = new Post(postProps);
    post.setPieceRates(pieceRates);

    postDTO = {
      postId: post.postId.toString(),
      name: 'Флорист',
      state: 'active',
      pieceRate: 2,
      pieceRates,
    };

    postToDelete = await postRepo.add(post);
  });

  afterEach(() => {
    return postRepo.clear();
  });

  context('when post exists', () => {
    context('when post not appointed by existing sellers', () => {
      test('should delete and return 202', async () => {
        const { statusCode, body } = await request()
          .delete(`/api/posts/${postToDelete.postId}`)
          .send();

        expect(statusCode).toBe(202);

        expect(body).toEqual({});
      });
    });
    context('when post appointed by existing sellers', () => {
      test('should not delete and return 409', async () => {
        const seller = new Seller({
          firstName: 'Firstname',
          middleName: 'Middlename',
          lastName: 'Lastname',
          phone: '00-00-00',
        });
        seller.addAppointment(postToDelete.postId, new Day());
        await sellerRepo.add(seller);

        const { statusCode, body } = await request()
          .delete(`/api/posts/${postToDelete.postId}`)
          .send();

        expect(statusCode).toBe(409);
        expect(body.type).toBe('NotAllowedError');
        expect(body.details).toEqual({
          post: ['There are sellers appointed to post "Флорист"'],
        });
      });
    });
  });

  context('when post does not exists', () => {
    test('should not delete and return 404', async () => {
      const fakePostId = uuidv4();

      const { statusCode, body } = await request()
        .delete(`/api/posts/${fakePostId}`)
        .send();

      expect(statusCode).toBe(404);
      expect(body.type).toBe('NotFoundError');
      expect(body.details).toEqual({
        postId: [`Post with postId: "${fakePostId}" not found`],
      });
    });
  });
});
