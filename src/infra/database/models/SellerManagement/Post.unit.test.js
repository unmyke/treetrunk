import { Op } from 'sequelize';
import { factory } from 'src/infra/support/test/factory';
import { cleanDatabase } from 'src/infra/support/test/cleanDatabase';

import { container } from 'src/container';

const {
  subdomains: {
    SellerManagement: { Post },
  },
  commonTypes: { Day },
  mappers: {
    subdomains: {
      SellerManagement: { Post: postMapper },
    },
  },
  models: {
    SellerManagement: { Post: PostModel },
  },
  database,
} = container;

const postProps = {
  name: 'Флорист',
};
const post = new Post(postProps);
const pieceRateDay = new Day();
post.addPieceRate(5, new Day(pieceRateDay));

const expectedUniqueErrors = ["post's name must be unique"];

describe('Infra :: Model :: Post', () => {
  beforeEach(() => {
    return cleanDatabase();
  });

  afterAll(() => {
    return database.close();
  });

  describe('#findAll', () => {
    beforeEach(() => {
      return factory.createMany(
        'post',
        [{ name: 'Post 1' }, { name: 'Post 2' }],
        { pieceRatesCount: 1 }
      );
    });

    test('returns all posts from the database', async () => {
      expect.assertions(7);
      const posts = await PostModel.scope('piece_rates').findAll();

      expect(posts.length).toBe(2);

      const post1 = posts.find(({ name }) => name === 'Post 1');
      const post2 = posts.find(({ name }) => name === 'Post 2');

      expect(post1.piece_rates).toHaveLength(1);
      expect(post1.piece_rates[0]).toHaveProperty('value');
      expect(post1.piece_rates[0]).toHaveProperty('day');

      expect(post2.piece_rates).toHaveLength(1);
      expect(post2.piece_rates[0]).toHaveProperty('value');
      expect(post2.piece_rates[0]).toHaveProperty('day');
    });
  });

  describe('#findById', () => {
    beforeEach(() => {
      return factory.create('post', { name: 'The Post' });
    });

    context('when post exists', () => {
      test('returns the post', async () => {
        expect.assertions(2);

        const posts = await PostModel.findAll();
        expect(posts.length).toBe(1);
        const { post_id } = posts[0];

        const post = await PostModel.findById(post_id);
        expect(post.name).toBe('The Post');
      });
    });

    context('when the post does not exist', () => {
      test('returns null', async () => {
        expect.assertions(1);

        expect(await PostModel.findById(-1)).toBeNull();
      });
    });
  });

  describe('#findOne', () => {
    beforeEach(() => {
      return factory.createMany('post', [
        { name: 'Post 1' },
        { name: 'Post 2' },
      ]);
    });

    context('when post exists', () => {
      test('returns the post', async () => {
        expect.assertions(1);

        const post = await PostModel.findOne({
          where: {
            name: {
              [Op.like]: '% 1',
            },
          },
        });

        expect(post.name).toBe('Post 1');
      });
    });

    context('when the post does not exist', () => {
      test('returns null', async () => {
        expect.assertions(1);

        const post = await PostModel.findOne({
          where: {
            name: {
              [Op.notLike]: 'Post%',
            },
          },
        });

        expect(post).toBeNull();
      });
    });
  });

  describe('#add', () => {
    context('when post is valid', () => {
      test('persists the post', async () => {
        expect.assertions(2);

        const countBefore = await PostModel.count();
        const persistedPost = await PostModel.create(
          postMapper.toDatabase(post)
        );

        expect(persistedPost.name).toBe(post.name);

        const countAfter = await PostModel.count();
        expect(countAfter - countBefore).toBe(1);
      });
    });

    context('when post is invalid', () => {
      test('does not persist the post and rejects with an error', async () => {
        expect.assertions(3);

        const expectedErrors = [
          'post.name cannot be null',
          'post.state cannot be null',
        ];

        const countBefore = await PostModel.count();

        try {
          await PostModel.create({});
        } catch (error) {
          const { name, errors } = error;
          const recievedErrors = errors.map((e) => e.message);
          expect(name).toBe('SequelizeValidationError');
          expect(recievedErrors).toEqual(expectedErrors);
        }

        const countAfter = await PostModel.count();

        expect(countAfter - countBefore).toBe(0);
      });
    });

    context('when post is non-unique', () => {
      test('does not persist the post and rejects with an error', async () => {
        expect.assertions(3);

        const countBefore = await PostModel.count();

        await PostModel.create(postMapper.toDatabase(post));

        try {
          const sameSeler = new Post(postProps);
          await PostModel.create(postMapper.toDatabase(sameSeler));
        } catch (error) {
          const { name, errors } = error;
          const recievedErrors = errors.map((e) => e.message);
          expect(name).toBe('SequelizeUniqueConstraintError');
          expect(recievedErrors).toEqual(expectedUniqueErrors);
        }

        const countAfter = await PostModel.count();

        expect(countAfter - countBefore).toBe(1);
      });
    });
  });

  describe('#destroy', () => {
    beforeEach(() => {
      return factory.create('post', {
        name: 'Destroyed Post',
      });
    });

    test('destroys the post', async () => {
      expect.assertions(1);
      const countBefore = await PostModel.count();
      const post = await PostModel.findOne({
        where: {
          name: 'Destroyed Post',
        },
      });

      await post.destroy();

      const countAfter = await PostModel.count();
      expect(countBefore - countAfter).toBe(1);
    });
  });

  describe('#update', () => {
    beforeEach(() => {
      return factory.createMany('post', [
        { name: 'Post to update 1' },
        { name: 'Post to update 2' },
      ]);
    });

    context('when post is valid', () => {
      test('updates post', async () => {
        expect.assertions(2);
        const post = await PostModel.findOne({
          where: {
            name: 'Post to update 1',
          },
        });
        const { post_id } = post;
        expect(post.name).toBe('Post to update 1');
        await post.update({ name: 'New Post' });
        const updatedPost = await PostModel.findById(post_id);
        expect(updatedPost.name).toBe('New Post');
      });
    });

    context('when post is non-unique', () => {
      test('does not persist the post and rejects with an error', async () => {
        expect.assertions(3);

        const {
          name,
          first_name,
          middle_name,
          phone,
        } = await PostModel.findOne({
          where: {
            name: 'Post to update 1',
          },
        });

        const post = await PostModel.findOne({
          where: {
            name: 'Post to update 2',
          },
        });
        const { post_id } = post;

        try {
          await post.update({ name, first_name, middle_name, phone });
        } catch (error) {
          const { name, errors } = error;
          const recievedErrors = errors.map((e) => e.message);
          expect(name).toBe('SequelizeUniqueConstraintError');
          expect(recievedErrors).toEqual(expectedUniqueErrors);
        }

        const updatedPost = await PostModel.findById(post_id);
        expect(updatedPost.name).toBe('Post to update 2');
      });
    });
  });
});
