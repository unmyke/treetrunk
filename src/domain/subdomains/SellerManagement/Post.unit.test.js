import { startOfDay } from 'date-fns';
import { Day, PostId } from '../../commonTypes';
import { Post } from './Post';
import { PieceRate } from './PieceRate';

const name = 'Флорист';

const pieceRate1value = 4;
const pieceRate2value = 2;
const pieceRate3value = 5.5;

const newDay = new Day();
const pieceRate1day = new Day({ value: new Date('2018.01.14 11:00') });
const pieceRate2day = new Day({ value: new Date('2018.02.20 11:00') });
const pieceRate3day = new Day({ value: new Date('2018.03.14 11:00') });

const pieceRates = [
  { value: pieceRate1value, day: pieceRate1day },
  { value: pieceRate2value, day: pieceRate2day },
  { value: pieceRate3value, day: pieceRate3day },
];

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

  describe('#setPieceRates', () => {
    context('when post is active', () => {
      test('should set piece rates', () => {
        post.setPieceRates(pieceRates);
        expect(post.pieceRates).toEqual(pieceRates);
        expect(post.pieceRates).not.toBe(pieceRates);
      });
    });

    context('when post is inactive', () => {
      beforeEach(() => {
        post.inactivate();
        expect(post.state).toBe('inactive');
      });

      test('should not set piece rates and throw NOT_ALLOWED error', () => {
        try {
          post.setPieceRates(pieceRates);
        } catch (e) {
          expect(e.message).toBe('Not allowed');
          expect(e.details).toEqual({
            post: ['Not allowed to set piece rates from inactive state'],
          });
        }

        expect(post.pieceRates).toHaveLength(0);
      });
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
        } catch (e) {
          expect(e.details).toEqual({
            pieceRate: [
              'Piece rate with value "4" at 14.01.2018 already exists',
            ],
          });
        }
        expect(post.pieceRates).toHaveLength(1);
      });
    });

    context('when add same pieceRate day after', () => {
      test('should throw exeption', () => {
        post.addPieceRate(pieceRate1value, pieceRate1day);

        try {
          post.addPieceRate(pieceRate1value, newDay);
        } catch (e) {
          expect(e.details).toEqual({
            pieceRate: ['Previous piece rate already have value "4"'],
          });
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
        } catch (e) {
          expect(e.details).toEqual({
            pieceRate: ['Next piece rate already have value "4"'],
          });
        }
        expect(post.pieceRates).toHaveLength(2);
      });
    });
  });

  describe('#deletePieceRate', () => {
    context('when delete existing pieceRate', () => {
      test('should decrease pieceRates length', () => {
        post.addPieceRate(pieceRate2value, pieceRate2day);
        post.addPieceRate(pieceRate3value, pieceRate3day);
        post.addPieceRate(pieceRate1value, pieceRate1day);
        expect(post.pieceRates).toHaveLength(3);

        post.deletePieceRate(pieceRate3value, pieceRate3day);

        expect(post.pieceRates).toHaveLength(2);
      });
    });

    context('when delete post twice', () => {
      test('should throw exeption', () => {
        post.addPieceRate(pieceRate2value, pieceRate2day);
        post.addPieceRate(pieceRate3value, pieceRate3day);
        post.addPieceRate(pieceRate1value, pieceRate1day);

        post.deletePieceRate(pieceRate3value, pieceRate3day);

        try {
          post.deletePieceRate(pieceRate3value, pieceRate3day);
        } catch (e) {
          expect(e.details).toEqual({
            pieceRate: ['Piece rate with value "5.5" at 14.03.2018 not found'],
          });
          expect(post.pieceRates).toHaveLength(2);
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
          post.deletePieceRate(pieceRate2value, pieceRate2day);
        } catch (e) {
          expect(e.details).toEqual({
            pieceRate: [
              'Previous piece rate value and next piece rate value are equal',
            ],
          });
        }
        expect(post.pieceRates).toHaveLength(3);
      });
    });
  });

  describe('#getInstanceAt', () => {
    beforeEach(() => {
      post.setPieceRates([
        { value: pieceRate3value, day: pieceRate3day },
        { value: pieceRate2value, day: pieceRate2day },
        { value: pieceRate1value, day: pieceRate1day },
      ]);
      expect(post.pieceRates).toHaveLength(3);
    });

    context('when passed no props', () => {
      test('should return equal post, but not this', () => {
        const newPost = post.getInstanceAt();
        expect(JSON.stringify(newPost)).toEqual(JSON.stringify(post));
        expect(post.getInstanceAt()).not.toBe(post);
      });
    });

    context('when passed day at penultimate piece rate', () => {
      let expectedPost;
      beforeEach(() => {
        expectedPost = new Post(post);
        expectedPost.setPieceRates([
          { value: pieceRate1value, day: pieceRate1day },
          { value: pieceRate2value, day: pieceRate2day },
        ]);
      });
      test('should return equal post without last piece rate', () => {
        const newPost = post.getInstanceAt(
          post.pieceRates[post.pieceRates.length - 2].day
        );

        expect(JSON.stringify(newPost)).toEqual(JSON.stringify(expectedPost));
      });
    });

    context('when passed day before piece rate exists', () => {
      let expectedPost;
      beforeEach(() => {
        expectedPost = new Post(post);
      });

      test('should return equal post with empty piece rates array', () => {
        const newPost = post.getInstanceAt(post.pieceRates[0].day.prev());

        expect(JSON.stringify(newPost)).toEqual(JSON.stringify(expectedPost));
      });
    });
  });
  // describe('#editPieceRate', () => {
  //   beforeEach(() => {
  //     post.addPieceRate(pieceRate1value, pieceRate1day);
  //   });

  //   context('when appointment has created with wrong pieceRate', () => {
  //     test('should change associated pieceRate', () => {
  //       post.editPieceRate(
  //         pieceRate1value,
  //         pieceRate1day,
  //         pieceRate2value,
  //         pieceRate1day
  //       );

  //       expect(post.pieceRates[0].day).toEqual(
  //         new Day({ value: startOfDay(pieceRate1day) })
  //       );
  //       expect(post.getPieceRateAt()).toBe(pieceRate2value);
  //     });
  //   });

  //   context('when pieceRate has created with wrong date', () => {
  //     test('should change associated date', () => {
  //       post.editPieceRate(
  //         pieceRate1value,
  //         pieceRate1day,
  //         pieceRate1value,
  //         pieceRate2day
  //       );
  //       expect(post.getPieceRateAt(pieceRate1day)).toEqual(undefined);
  //       expect(post.pieceRates).toHaveLength(1);
  //       expect(post.getPieceRateAt(pieceRate2day)).toBe(pieceRate1value);
  //     });
  //   });
  // });
  describe('#inactivate', () => {
    context('when post\'s state is "active"', () => {
      beforeEach(() => {
        expect(post.state).toBe('active');
      });

      test('should change state to "inactive"', () => {
        post.inactivate();
        expect(post.state).toBe('inactive');
      });
    });

    context('when post\'s state is "inactive"', () => {
      beforeEach(() => {
        post.inactivate();
        expect(post.state).toBe('inactive');
      });

      test('should not change state and throw NOT_ALLOWED error', () => {
        try {
          post.inactivate();
        } catch (e) {
          expect(e.message).toBe('Not allowed');
          expect(e.details).toEqual({
            post: ['Not allowed to inactivate from inactive state'],
          });
        }

        expect(post.state).toBe('inactive');
      });
    });
  });

  describe('#activate', () => {
    context('when post\'s state is "inactive"', () => {
      beforeEach(() => {
        post.inactivate();
        expect(post.state).toBe('inactive');
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
      } catch (e) {
        expect(e.message).toBe('Not allowed');
        expect(e.details).toEqual({
          post: ['Not allowed to activate from active state'],
        });
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
        } catch (e) {
          expect(e.message).toBe('Nothing to update');
          expect(e.details).toEqual({
            post: ['Post in active state already has name "Флорист"'],
          });
        }

        expect(post.name).toBe('Флорист');
      });
    });
  });
});
