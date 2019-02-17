import uuidv4 from 'uuid/v4';
import factory from '@infra/support/test/factory';
import cleanDatabase from '@infra/support/test/clean-database';

import container from '@container';
import PostIdMapper from '../../../mappers/common-types/post-id';

const getRawPost = ({ postId, name, phone, pieceRates }) => ({
  postId,
  name,
  phone,
  pieceRates,
});

const {
  subdomains: {
    SellerManagement: { Post },
  },
  commonTypes: { Day, PostId },
  repositories: {
    SellerManagement: { Post: postRepo },
  },
  models: {
    SellerManagement: { Post: PostModel, PostPieceRate: PostPieceRateModel },
  },
  mappers: {
    subdomains: {
      SellerManagement: { Post: postMapper },
    },
  },
  database,
} = container;
const postIdMapper = new PostIdMapper({ commonTypes: { PostId } });

const value = 2.5;

const postProps = {
  name: 'Name',
};

const newPostProps = {
  name: `${postProps.name}_new`,
};

const day = new Day({ value: new Date('2018.01.01') });
const newDay = new Day();

let postEntity;
let postId;
let newPostEntity;

describe('Infra :: Repository :: Post', () => {
  beforeEach(() => {
    postId = new PostId({ value: uuidv4() });
    postEntity = new Post({ ...postProps, postId });

    return cleanDatabase();
  });

  afterAll(() => {
    return database.close();
  });

  describe('#getById', () => {
    context('when there is post in db', () => {
      beforeEach(() => {
        return factory.create('post', postMapper.toDatabase(postEntity));
      });

      test('should return array of posts', async () => {
        expect.assertions(2);

        const post = await postRepo.getById(postId);

        expect(post).toBeInstanceOf(Post);
        expect(post.postId).toEqual(postId);
      });
    });

    context('when there is no post in db', () => {
      test('should throw not found error', async () => {
        expect.assertions(1);
        try {
          await postRepo.getById(postId);
        } catch ({ message }) {
          expect(message).toBe('POST_NOT_FOUND');
        }
      });
    });
  });

  describe('#getAll', () => {
    context('when there are posts in db', () => {
      beforeEach(() => {
        return factory.createMany('post', [
          { name: 'Post1', state: 'deleted' },
          { name: 'Post2', state: 'active' },
          { name: 'Post3', state: 'deleted' },
          { name: 'Post4', state: 'active' },
        ]);
      });

      test('should return array of posts', async () => {
        expect.assertions(4);

        const posts = await postRepo.getAll();

        expect(posts).toHaveLength(2);
        expect(posts[0]).toBeInstanceOf(Post);
        expect(posts[0].state).toBe('active');
        expect(posts[1].state).toBe('active');
      });
    });

    context('when there are no posts in db', () => {
      test('should return empty array', async () => {
        expect.assertions(1);

        const posts = await postRepo.getAll();

        expect(posts).toHaveLength(0);
      });
    });
  });

  describe('#find', () => {
    let postIds;

    beforeEach(() => {
      return factory
        .createMany('post', [
          { name: 'post1', state: 'active' },
          { state: 'deleted' },
          { name: 'post2', state: 'active' },
          { state: 'deleted' },
          { name: 'post3', state: 'active' },
          { state: 'deleted' },
          { name: 'post4', state: 'active' },
          { state: 'active' },
          { name: 'post5', state: 'active' },
        ])
        .then((posts) => {
          postIds = posts
            .map(({ post_id }) => new PostId({ value: post_id }))
            .filter((postId, index) => index % 3 === 0);
        })
        .catch((e) => {
          console.log(e);
        });
    });

    context('when passed states-query', () => {
      context('when there are active posts in db', () => {
        test('should return array of posts', async () => {
          expect.assertions(3);

          const posts = await postRepo.find({ states: ['active'] });

          expect(posts).toHaveLength(6);
          expect(posts[0]).toBeInstanceOf(Post);
          expect(posts[0].state).toBe('active');
        });
      });

      context('when there are deleted posts in db', () => {
        test('should return array of posts', async () => {
          expect.assertions(3);

          const posts = await postRepo.find({ states: ['deleted'] });

          expect(posts).toHaveLength(3);
          expect(posts[0]).toBeInstanceOf(Post);
          expect(posts[0].state).toBe('deleted');
        });
      });

      context('when there are active and deleted posts in db', () => {
        test('should return array of posts', async () => {
          expect.assertions(3);

          const posts = await postRepo.find({ states: ['active', 'deleted'] });

          expect(posts).toHaveLength(9);
          expect(posts[0]).toBeInstanceOf(Post);
          expect(['active', 'deleted']).toContain(posts[0].state);
        });
      });
    });

    context('when passed postIds-query', () => {
      context(
        'when there are posts with postId in passed postIds-query in db',
        () => {
          test('should return array of posts', async () => {
            expect.assertions(5);

            const posts = await postRepo.find({
              postIds,
            });

            expect(posts).toHaveLength(3);
            expect(posts[0]).toBeInstanceOf(Post);
            expect(postIds.map(postIdMapper.toDatabase)).toContain(
              postIdMapper.toDatabase(posts[0].postId)
            );
            expect(postIds.map(postIdMapper.toDatabase)).toContain(
              postIdMapper.toDatabase(posts[1].postId)
            );
            expect(postIds.map(postIdMapper.toDatabase)).toContain(
              postIdMapper.toDatabase(posts[2].postId)
            );
          });
        }
      );
    });

    context('when passed postIds-query and states-query', () => {
      context(
        'when there are posts with postId in passed postIds-query in db',
        () => {
          test('should return array of posts', async () => {
            expect.assertions(6);

            const posts = await postRepo.find({
              postIds,
              states: ['active'],
            });

            expect(posts).toHaveLength(2);
            expect(posts[0]).toBeInstanceOf(Post);
            expect(postIds.map(postIdMapper.toDatabase)).toContain(
              postIdMapper.toDatabase(posts[0].postId)
            );
            expect(posts[0].state).toBe('active');
            expect(postIds.map(postIdMapper.toDatabase)).toContain(
              postIdMapper.toDatabase(posts[1].postId)
            );
            expect(posts[1].state).toBe('active');
          });
        }
      );
    });

    context('when passed search-query', () => {
      context(
        'when there are posts with name like seacrh string in passed search-query in db',
        () => {
          test('should return array of posts', async () => {
            expect.assertions(7);

            const posts = await postRepo.find({
              search: 'pOst',
            });

            expect(posts).toHaveLength(5);
            expect(posts[0]).toBeInstanceOf(Post);
            expect(posts[0].name).toMatch(/.*post.*/);
            expect(posts[1].name).toMatch(/.*post.*/);
            expect(posts[2].name).toMatch(/.*post.*/);
            expect(posts[3].name).toMatch(/.*post.*/);
            expect(posts[4].name).toMatch(/.*post.*/);
          });
        }
      );
    });
  });

  describe('#add', () => {
    context('when pass post without pieceRates', () => {
      test('should return post with empty pieceRates array', async () => {
        expect.assertions(2);

        const post = await postRepo.add(postEntity);

        expect(post).toBeInstanceOf(Post);
        expect(getRawPost(post)).toEqual(getRawPost(postEntity));
      });
    });

    context('when pass post with pieceRates', () => {
      beforeEach(() => {
        postEntity.addPieceRate(value, day);

        expect(postEntity.pieceRates).toHaveLength(1);
      });

      test('should return post with pieceRates array', async () => {
        expect.assertions(3);

        const post = await postRepo.add(postEntity);

        expect(post).toBeInstanceOf(Post);
        expect(getRawPost(post)).toEqual(getRawPost(postEntity));
      });
    });

    context('when re-add same post', () => {
      beforeEach(() => {
        postEntity.addPieceRate(value, day);

        expect(postEntity.pieceRates).toHaveLength(1);
        return postRepo.add(postEntity);
      });

      test('should throw already exists error', async () => {
        expect.assertions(3);

        const countBefore = await postRepo.count();

        try {
          await postRepo.add(postEntity);
        } catch ({ message }) {
          expect(message).toBe('POST_ALREADY_EXISTS');
        }

        const countAfter = await postRepo.count();
        expect(countBefore).toBe(countAfter);
      });
    });

    context('when add ununique post', () => {
      beforeEach(() => {
        return postRepo.add(postEntity);
      });

      test('should throw already exists error', async () => {
        expect.assertions(2);

        const countBefore = await postRepo.count();

        try {
          await postRepo.add(postEntity);
        } catch ({ message }) {
          expect(message).toBe('POST_ALREADY_EXISTS');
        }

        const countAfter = await postRepo.count();
        expect(countBefore).toBe(countAfter);
      });
    });
  });

  describe('#delete', () => {
    context('when post exists', () => {
      beforeEach(() => {
        return factory.create('post', postMapper.toDatabase(postEntity), {
          pieceRatesCount: 0,
        });
      });

      test('should delete post and return true', async () => {
        expect.assertions(3);

        const postsCountBefore = await postRepo.count();
        const pieceRatesCountBefore = await PostPieceRateModel.count();

        const result = await postRepo.delete(postId);

        const postsCountAfter = await postRepo.count();
        const pieceRatesCountAfter = await PostPieceRateModel.count();

        expect(result).toBeTruthy();
        expect(postsCountBefore).toBe(postsCountAfter + 1);
        expect(pieceRatesCountBefore).toBe(pieceRatesCountAfter);
      });
    });

    context('when post not exists', () => {
      test('should throw not found error', async () => {
        expect.assertions(2);

        const countBefore = await postRepo.count();

        try {
          await postRepo.delete(postId);
        } catch ({ message }) {
          expect(message).toBe('POST_NOT_FOUND');
        }

        const countAfter = await postRepo.count();
        expect(countBefore).toBe(countAfter);
      });
    });
  });

  describe('#update', () => {
    beforeEach(() => {
      return factory.create('post', postMapper.toDatabase(postEntity), {
        pieceRatesCount: 0,
      });
    });

    context('when post with update props exists', () => {
      beforeEach(() => {
        newPostEntity = new Post({ ...newPostProps, postId });
      });

      context("when updated post's props are unique", () => {
        test('should return updated post', async () => {
          expect.assertions(1);

          const post = await postRepo.update(newPostEntity);

          expect(getRawPost(post)).toEqual(getRawPost(newPostEntity));
        });
      });

      context("when updated post's props are non-unique", () => {
        beforeEach(() => {
          return factory.create(
            'post',
            postMapper.toDatabase(new Post(newPostProps))
          );
        });

        test('should throw already exists error', async () => {
          expect.assertions(2);

          try {
            await postRepo.update(newPostEntity);
          } catch ({ message }) {
            expect(message).toBe('POST_ALREADY_EXISTS');
          }

          expect(getRawPost(await postRepo.getById(postId))).toEqual(
            getRawPost(postEntity)
          );
        });
      });
    });

    context('when updated post not exists', () => {
      beforeEach(() => {
        newPostEntity = new Post(newPostProps);
      });

      test('should throw not found error', async () => {
        expect.assertions(1);

        try {
          await postRepo.update(newPostEntity);
        } catch ({ message }) {
          expect(message).toBe('POST_NOT_FOUND');
        }
      });
    });
  });

  describe('#addPieceRate', () => {
    let pieceRatesCountBefore;

    beforeEach(() => {
      return factory
        .create('post', postMapper.toDatabase(postEntity), {
          pieceRatesCount: 0,
        })
        .then((post) => {
          postEntity.addPieceRate(value, day);
          pieceRatesCountBefore = post.piece_rates.length;
        });
    });

    test('should return true', async () => {
      expect.assertions(2);

      const result = await postRepo.addPieceRate(postId, value, day);
      const pieceRatesCountAfter = await PostPieceRateModel.count();

      expect(result).toBeTruthy();
      expect(pieceRatesCountAfter).toBe(pieceRatesCountBefore + 1);
    });
  });

  describe('#deletePieceRateAt', () => {
    let pieceRatesCountBefore;

    beforeEach(() => {
      postEntity.addPieceRate(value, day);

      return factory
        .create('post', postMapper.toDatabase(postEntity))
        .then((post) => {
          pieceRatesCountBefore = post.piece_rates.length;
        });
    });

    test('should return true', async () => {
      expect.assertions(2);

      const result = await postRepo.deletePieceRateAt(postId, day);
      const pieceRatesCountAfter = await PostPieceRateModel.count();

      expect(result).toBeTruthy();
      expect(pieceRatesCountAfter).toBe(pieceRatesCountBefore - 1);
    });
  });

  describe('#updatePieceRateTo', () => {
    let pieceRatesCountBefore;
    let newValue;

    beforeEach(() => {
      postEntity.addPieceRate(value, day);
      newValue = 3.5;

      return factory
        .create('post', postMapper.toDatabase(postEntity))
        .then((post) => {
          pieceRatesCountBefore = post.piece_rates.length;
        });
    });

    test('should return true', async () => {
      expect.assertions(3);

      const result = await postRepo.updatePieceRateTo(
        postId,
        day,
        newValue,
        newDay
      );
      const pieceRatesCountAfter = await PostPieceRateModel.count();

      expect(result).toBeTruthy();
      expect(pieceRatesCountAfter).toBe(pieceRatesCountBefore);
      expect(
        await PostPieceRateModel.count({
          where: {
            post_id: postId.value,
            value: newValue,
            day: newDay.value,
          },
        })
      ).toBe(1);
    });
  });
});
