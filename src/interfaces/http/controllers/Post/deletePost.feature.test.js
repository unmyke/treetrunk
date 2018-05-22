import uuidv4 from 'uuid/v4';
import { format } from 'date-fns';

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

const date1 = new Date('2018.01.21');
const date2 = new Date('2018.02.21');
const day1 = new Day({ value: date1 });
const day2 = new Day({ value: date2 });

const postProps = { name: 'Флорист' };

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
      pieceRate: 2,
      pieceRates,
    };

    postToDelete = await postRepo.add(post);
  });

  afterEach(() => {
    return postRepo.clear();
  });

  context('when post exists', () => {
    test('should delete and return 202', async () => {
      const { statusCode, body } = await request()
        .delete(`/api/posts/${postToDelete.postId}`)
        .send();

      expect(statusCode).toBe(202);

      expect(body).toEqual({});
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

  context('when post is appointed by existing sellers', () => {
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
