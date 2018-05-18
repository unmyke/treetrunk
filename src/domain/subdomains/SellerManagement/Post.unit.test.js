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
          expect(e.details).toEqual(['Post already have this pieceRate']);
          expect(post.pieceRates).toHaveLength(1);
        }
      });
    });

    context('when add same pieceRate another day after', () => {
      test('should throw exeption', () => {
        post.addPieceRate(pieceRate1value, pieceRate1day);

        try {
          post.addPieceRate(pieceRate1value, newDay);
        } catch (e) {
          expect(e.details).toEqual(['Post already have this pieceRate']);
          expect(post.pieceRates).toHaveLength(1);
        }
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
    beforeEach(() => {
      post.addPieceRate(pieceRate2value, pieceRate2day);
      post.addPieceRate(pieceRate3value, pieceRate3day);
      post.addPieceRate(pieceRate1value, pieceRate1day);
    });

    context('when delete existing pieceRate', () => {
      test('should decrease pieceRates length', () => {
        expect(post.pieceRates).toHaveLength(3);

        post.deletePieceRate(pieceRate3value, pieceRate3day);

        expect(post.pieceRates).toHaveLength(2);
      });
    });

    context('when delete post twice', () => {
      test('should throw exeption', () => {
        post.deletePieceRate(pieceRate3value, pieceRate3day);

        try {
          post.deletePieceRate(pieceRate3value, pieceRate3day);
        } catch (e) {
          expect(e.details).toEqual(['Post have not such pieceRate']);
          expect(seller.appointments).toHaveLength(2);
        }
      });
    });
  });

  describe('#editPieceRate', () => {
    beforeEach(() => {
      post.addPieceRate(pieceRate1value, pieceRate1day);
    });

    context('when appointment has created with wrong pieceRate', () => {
      test('should change associated pieceRate', () => {
        post.editPieceRate(
          pieceRate1value,
          pieceRate1day,
          pieceRate2value,
          pieceRate1day
        );

        expect(post.pieceRates[0].day).toEqual(
          new Day({ value: startOfDay(pieceRate1day) })
        );
        expect(post.getPieceRateAt()).toBe(pieceRate2value);
      });
    });

    context('when pieceRate has created with wrong date', () => {
      test('should change associated date', () => {
        post.editPieceRate(
          pieceRate1value,
          pieceRate1day,
          pieceRate1value,
          pieceRate2day
        );
        expect(post.pieceRates).toHaveLength(1);
        expect(post.getPieceRateAt(pieceRate1day)).toEqual(undefined);
        expect(post.getPieceRateAt(pieceRate2day)).toBe(pieceRate1value);
      });
    });
  });
});
