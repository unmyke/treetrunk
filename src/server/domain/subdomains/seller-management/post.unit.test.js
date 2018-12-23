import { startOfDay } from 'date-fns';

import { Day, PostId } from '../../common-types';
import { Post as states } from '../../states';

import { Post } from './post';

const getRawPost = ({ postId, name, state, pieceRates }) => ({
  postId,
  name,
  state,
  pieceRates,
});

const name = 'Флорист';

const pieceRate1value = 4;
const pieceRate2value = 2;
const pieceRate3value = 5.5;

const newDay = new Day();
const pieceRate1day = new Day({ value: new Date('2018.01.14 11:00') });
const pieceRate2day = new Day({ value: new Date('2018.02.20 11:00') });
const pieceRate3day = new Day({ value: new Date('2018.03.14 11:00') });

const pieceRate1 = {
  value: pieceRate1value,
  day: pieceRate1day,
};
const pieceRate2 = {
  value: pieceRate2value,
  day: pieceRate2day,
};
const pieceRate3 = {
  value: pieceRate3value,
  day: pieceRate3day,
};

const pieceRates = [pieceRate3, pieceRate1, pieceRate2];

describe('Domain :: entities :: Post', () => {
  let post;
  beforeEach(() => {
    post = new Post({ name });
  });

  describe('#constructor', () => {
    test('should be instance of Post', () => {
      expect(post).toBeInstanceOf(Post);
      expect(post.postId).toBeInstanceOf(PostId);
      expect(post.pieceRates).toHaveLength(0);
    });
  });

  describe('#addPieceRate', () => {
    context('when add one pieceRate value', () => {
      test('should have pieceRates length equal 1', () => {
        post.addPieceRate(pieceRate1value, pieceRate1day);

        expect(post.pieceRates).toHaveLength(1);
      });
    });

    context('when add same pieceRate twice a day', () => {
      test('should throw exeption', () => {
        post.addPieceRate(pieceRate1value, pieceRate1day);

        try {
          post.addPieceRate(pieceRate1value, pieceRate1day);
        } catch (error) {
          expect(error.message).toBe('PIECE_RATE_ALREADY_EXISTS');
        }

        expect(post.pieceRates).toHaveLength(1);
      });
    });

    context('when add same pieceRate day after', () => {
      test('should throw exeption', () => {
        post.addPieceRate(pieceRate1value, pieceRate1day);

        try {
          post.addPieceRate(pieceRate1value, newDay);
        } catch (error) {
          expect(error.message).toBe('PIECE_RATE_DUPLICATE');
        }

        expect(post.pieceRates).toHaveLength(1);
      });
    });

    context('when add same pieceRate day before', () => {
      test('should throw exeption', () => {
        post.addPieceRate(pieceRate1value, pieceRate2day);
        post.addPieceRate(pieceRate3value, pieceRate3day);
        expect(post.pieceRates).toHaveLength(2);

        try {
          post.addPieceRate(pieceRate1value, pieceRate1day);
        } catch (error) {
          expect(error.message).toBe('PIECE_RATE_DUPLICATE');
        }

        expect(post.pieceRates).toHaveLength(2);
      });
    });
  });

  describe('#deletePieceRateAt', () => {
    context('when delete existing pieceRate', () => {
      test('should decrease pieceRates length', () => {
        post.addPieceRate(pieceRate2value, pieceRate2day);
        post.addPieceRate(pieceRate3value, pieceRate3day);
        post.addPieceRate(pieceRate1value, pieceRate1day);
        expect(post.pieceRates).toHaveLength(3);

        post.deletePieceRateAt(pieceRate3day);

        expect(post.pieceRates).toHaveLength(2);
      });
    });

    context('when delete post twice', () => {
      test('should throw exeption', () => {
        post.addPieceRate(pieceRate2value, pieceRate2day);
        post.addPieceRate(pieceRate3value, pieceRate3day);
        post.addPieceRate(pieceRate1value, pieceRate1day);

        post.deletePieceRateAt(pieceRate3day);

        try {
          post.deletePieceRateAt(pieceRate3day);
        } catch (error) {
          expect(error.message).toBe('PIECE_RATE_NOT_FOUND');
        }
      });
    });

    context('when delete post between equal piece rates', () => {
      test('should throw exeption', () => {
        post.addPieceRate(pieceRate2value, pieceRate2day);
        post.addPieceRate(pieceRate1value, pieceRate3day);
        post.addPieceRate(pieceRate1value, pieceRate1day);
        expect(post.pieceRates).toHaveLength(3);

        try {
          post.deletePieceRateAt(pieceRate2day);
        } catch (error) {
          expect(error.message).toBe('PIECE_RATE_HAS_EQUAL_NEIGHBOURS');
        }

        expect(post.pieceRates).toHaveLength(3);
      });
    });
  });

  describe('#instanceAt', () => {
    beforeEach(() => {
      post = Post.restore({
        postId: new PostId(),
        name,
        state: states.ACTIVE,
        pieceRates: [
          { value: pieceRate3value, day: pieceRate3day },
          { value: pieceRate2value, day: pieceRate2day },
          { value: pieceRate1value, day: pieceRate1day },
        ],
      });
      expect(post.pieceRates).toHaveLength(3);
    });

    context('when passed no props', () => {
      test('should return equal post, but not this', () => {
        const newPost = Post.instanceAt(post);

        expect(getRawPost(newPost)).toEqual(getRawPost(post));
        expect(newPost).not.toBe(post);
      });
    });

    context('when passed day at penultimate piece rate', () => {
      let expectedPost;

      beforeEach(() => {
        expectedPost = Post.restore({
          postId: post.postId,
          name,
          state: states.ACTIVE,
          pieceRates: [
            { value: pieceRate1value, day: pieceRate1day },
            { value: pieceRate2value, day: pieceRate2day },
          ],
        });
      });
      test('should return equal post without last piece rate', () => {
        const newPost = Post.instanceAt(post, pieceRate2day);

        expect(getRawPost(newPost)).toEqual(getRawPost(expectedPost));
      });
    });

    context('when passed day before piece rate exists', () => {
      let expectedPost;
      beforeEach(() => {
        expectedPost = new Post(post);
      });

      test('should return equal post with empty piece rates array', () => {
        const newPost = Post.instanceAt(post, pieceRate1day.prev());

        expect(getRawPost(newPost)).toEqual(getRawPost(expectedPost));
      });
    });
  });
  describe('#updatePieceRateTo', () => {
    beforeEach(() => {
      post.addPieceRate(pieceRate1value, pieceRate1day);
    });

    context('when appointment has created with wrong pieceRate', () => {
      test('should change associated pieceRate', () => {
        post.updatePieceRateTo(pieceRate1day, pieceRate3value, pieceRate1day);

        expect(post.pieceRates[0].day).toEqual(
          new Day({ value: startOfDay(pieceRate1day) })
        );
      });
    });

    context('when pieceRate has created with wrong date', () => {
      test('should change associated date', () => {
        post.updatePieceRateTo(pieceRate1day, pieceRate1value, pieceRate2day);
        expect(post.pieceRates).toHaveLength(1);
      });
    });
  });
  describe('#inactivate', () => {
    context('when post\'s state is "active"', () => {
      beforeEach(() => {
        expect(post.state).toBe('active');
      });

      test('should change state to "deleted"', () => {
        post.inactivate();
        expect(post.state).toBe('deleted');
      });
    });

    context('when post\'s state is "deleted"', () => {
      beforeEach(() => {
        post.inactivate();
        expect(post.state).toBe('deleted');
      });

      test('should not change state and throw NOT_ALLOWED error', () => {
        try {
          post.inactivate();
        } catch (error) {
          expect(error.message).toBe('TRANSITION_NOT_ALLOWED');
        }

        expect(post.state).toBe('deleted');
      });
    });
  });

  describe('#activate', () => {
    context('when post\'s state is "deleted"', () => {
      beforeEach(() => {
        post.inactivate();
        expect(post.state).toBe('deleted');
      });
      test('should change state to "active"', () => {
        post.activate();
        expect(post.state).toBe('active');
      });
    });
  });

  context('when post\'s state is "active"', () => {
    beforeEach(() => {
      expect(post.state).toBe('active');
    });
    test('should not change state and throw NOT_ALLOWED error', () => {
      try {
        post.activate();
      } catch (error) {
        expect(error.message).toBe('TRANSITION_NOT_ALLOWED');
      }

      expect(post.state).toBe('active');
    });
  });

  describe('#update', () => {
    context("when passed name not equals post's name", () => {
      test('should set name', () => {
        post.update({ name: 'Старший флорист' });
        expect(post.name).toBe('Старший флорист');
      });
    });

    context("when passed name equals post's name", () => {
      test('should not change state and throw NOTHING_TO_UPDATE error', () => {
        try {
          post.update({ name: 'Флорист' });
        } catch (error) {
          expect(error.message).toBe('NOT_ALLOWED');
          expect(error.details).toEqual({ name: ['NOTHING_TO_UPDATE'] });
        }

        expect(post.name).toBe('Флорист');
      });
    });
  });
});
