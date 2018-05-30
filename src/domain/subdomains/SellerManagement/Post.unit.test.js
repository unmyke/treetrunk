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

    test('should have no pieceRate', () => {
      expect(post.getPieceRateAt()).toBeUndefined();
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
            pieceRate: ['Piece rate at 14.01.2018 already exists'],
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
            pieceRate: ['Piece rate value at 14.01.2018 already equals "4"'],
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
            pieceRate: ['Piece rate value at 20.02.2018 already equals "4"'],
          });
        }
        expect(post.pieceRates).toHaveLength(2);
      });
    });
  });

  describe('#getPieceRateAt', () => {
    beforeEach(() => {
      post.addPieceRate(pieceRate2value, pieceRate2day);
      post.addPieceRate(pieceRate3value, pieceRate3day);
      post.addPieceRate(pieceRate1value, pieceRate1day);
    });

    context('when requested before any pieceRate added to post', () => {
      test('should return undefined', () => {
        expect(post.getPieceRateAt(pieceRate1day.subDays(1))).toBeUndefined();
      });
    });

    context('when requested past pieceRate', () => {
      test("should return pieceRate's value belongs to that dateRange", () => {
        expect(post.getPieceRateAt(pieceRate2day)).toBe(pieceRate2value);
      });
    });

    context('when requested current pieceRate associated with post', () => {
      test("should return last pieceRate's value", () => {
        expect(post.pieceRate).toBe(pieceRate3value);
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
            pieceRate: ['Piece rate with value 5.5 at 14.03.2018 not found'],
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
              `Piece rate with value ${pieceRate2value} at ${pieceRate2day.format(
                'DD.MM.YYYY'
              )} not allowed to delete: piece rate at ${pieceRate1day.format(
                'DD.MM.YYYY'
              )} equals piece rate at ${pieceRate3day.format('DD.MM.YYYY')}`,
            ],
          });
        }
        expect(post.pieceRates).toHaveLength(3);
      });
    });
  });

  describe('#_getPrevPieceRateAt', () => {
    beforeEach(() => {
      post.setPieceRates([
        { value: pieceRate3value, day: pieceRate3day },
        { value: pieceRate1value, day: pieceRate1day },
      ]);
      expect(post.pieceRates).toHaveLength(2);
    });

    context('when passed day before first piece rate', () => {
      test('should return undefined', () => {
        expect(post._getPrevPieceRateAt(pieceRate1day.prev())).toBeUndefined();
      });
    });

    context('when passed day between piece rates', () => {
      test('should return previous piece rate', () => {
        expect(post._getPrevPieceRateAt(pieceRate2day)).toBe(
          post.pieceRates[0]
        );
      });
    });

    context('when passed current day', () => {
      test('should return last piece rate', () => {
        expect(post._getPrevPieceRateAt(new Day())).toBe(post.pieceRates[1]);
      });
    });
  });

  describe('#_getNextPieceRateAt', () => {
    beforeEach(() => {
      post.setPieceRates([
        { value: pieceRate3value, day: pieceRate3day },
        { value: pieceRate1value, day: pieceRate1day },
      ]);
      expect(post.pieceRates).toHaveLength(2);
    });

    context('when passed current day', () => {
      test('should return undefined', () => {
        expect(post._getNextPieceRateAt(new Day())).toBeUndefined();
      });
    });

    context('when passed day between piece rates', () => {
      test('should return next piece rate', () => {
        expect(post._getNextPieceRateAt(pieceRate2day)).toBe(
          post.pieceRates[1]
        );
      });
    });

    context('when passed day before first piece rate', () => {
      test('should return first piece rate', () => {
        const prevDay = pieceRate1day.prev();
        // console.log(`prevDay: ${prevDay.toString()}`);
        expect(post._getNextPieceRateAt(prevDay)).toBe(post.pieceRates[0]);
      });
    });
  });

  describe('#at', () => {
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
        expect(post.at()).toEqual(post);
        expect(post.at()).not.toBe(post);
      });
    });

    context('when passed day at penultimate piece rate', () => {
      test('should return equal post without last piece rate', () => {
        const expectedPost = new Post(post);
        expectedPost.setPieceRates([
          { value: pieceRate1value, day: pieceRate1day },
          { value: pieceRate2value, day: pieceRate2day },
        ]);

        expect(
          post.at(post.pieceRates[post.pieceRates.length - 2].day)
        ).toEqual(expectedPost);
      });
    });

    context('when passed day before piece rate exists', () => {
      test('should return equal post with empty piece rates array', () => {
        const expectedPost = new Post(post);

        expect(post.at(post.pieceRates[0].day.prev())).toEqual(expectedPost);
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
});
