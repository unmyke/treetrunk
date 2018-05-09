import { container } from 'src/container';
import { request } from 'src/infra/support/test/request';
import uuidv4 from 'uuid/v4';

const {
  domain: {
    entities: { Post },
    commonTypes: { Day },
  },
  repositories: { Post: postRepo },
} = container;

const pieceRateDate1 = new Date('2018.01.21');
const pieceRateDate2 = new Date('2018.02.21');
const pieceRateDay1 = new Day({ value: pieceRateDate1 });
const pieceRateDay2 = new Day({ value: pieceRateDate2 });

const postProps = { name: 'Флорист' };
const post = new Post(postProps);

post.addPieceRate(1, pieceRateDay1);
post.addPieceRate(2, pieceRateDay2);

const postDTO = {
  postId: post.postId.toString(),
  name: 'Флорист',
  currentPieceRate: 2,
  pieceRates: [
    { value: 1, date: '21.01.2018' },
    { value: 2, date: '21.02.2018' },
  ],
};

let postToUpdate;

describe('API :: POST /api/posts', () => {
  beforeEach(async () => {
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
      it('does update and returns 400 with the validation error', async () => {
        const { statusCode, body } = await request()
          .put(`/api/posts/${postToUpdate.postId}`)
          .send({
            name: '',
          });

        expect(statusCode).toBe(400);
        expect(body.type).toBe('ValidationError');
        expect(body.details).toHaveLength(1);
        expect(body.details[0]).toBe('"name" is not allowed to be empty');
      });
    });

    context('when send no props', () => {
      it('does update and returns 400 with the validation error', async () => {
        const { statusCode, body } = await request()
          .put(`/api/posts/${postToUpdate.postId}`)
          .send({
            name: '',
          });

        expect(statusCode).toBe(400);
        expect(body.type).toBe('ValidationError');
        expect(body.details).toHaveLength(1);
        expect(body.details[0]).toBe("Name can't be blank");
      });
    });
  });

  context('when post does not exist', () => {
    it('returns the not found message and status 404', async () => {
      const fakePostId = uuidv4();

      const { body } = await request()
        .put(`/api/posts/${fakePostId}`)
        .send({
          name: 'Страший флорист',
        })
        .expect(404);

      expect(body.type).toBe('NotFoundError');
      expect(body.details[0]).toBe("Post can't be found.");
    });
  });
});
