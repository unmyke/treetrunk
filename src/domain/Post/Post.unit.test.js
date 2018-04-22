import { Post } from './Post';
import { PostId } from './PostId';
import { PieceRate } from './PieceRate';
import { Day } from '../_lib/ValueObjects'

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

  describe('#construcor', () => {
    context('when contruct with only person name', () => {
      it('should be instance of Post', () => {
        expect(post).toBeInstanceOf(Post);
        expect(post.postId).toBeInstanceOf(PostId);
        expect(post.pieceRates).toHaveLength(0);
      });
    });
  });

  describe('#addPieceRate', () => {
    context('when add one value', () => {
      it('should have pieceRates length qual 1', () => {
        post.addPieceRate(pieceRate1value, pieceRate1day);

        expect(post.pieceRates).toHaveLength(1);
      });
    });

    context('when add to same value by same day', () => {
      it('should throw exeption', () => {
        post.addPieceRate(pieceRate1value, pieceRate1day);

        try {
          post.addPieceRate(pieceRate1value, pieceRate1day);
        }
        catch(e) {
          expect(e.details).toEqual(['Post already have this pieceRate']);
          expect(post.pieceRates).toHaveLength(1);
        }
      });
    });

    context('when add to same value, different day, but previous value is same', () => {
      it('should throw exeption', () => {
        post.addPieceRate(pieceRate1value, pieceRate1day);

        try {
          post.addPieceRate(pieceRate1value, newDay);
        }
        catch(e) {
          expect(e.details).toEqual(['Post already have this pieceRate']);
          expect(post.pieceRates).toHaveLength(1);
        }
      });
    });

    context('when add to different value, different day, but previous value is same', () => {
      it('should have pieceRates length qual 2', () => {
        post.addPieceRate(pieceRate2value, pieceRate2day);
        post.addPieceRate(pieceRate1value, pieceRate1day);

        expect(post.pieceRates).toHaveLength(2);
      });
    });
  });

  describe('#getPieceRateAtDate', () => {
    beforeEach(() => {
      post.addPieceRate(pieceRate2value, pieceRate2day);
      post.addPieceRate(pieceRate3value, pieceRate3day);
      post.addPieceRate(pieceRate1value, pieceRate1day);
    });

    context('when day before first pieceRate', () => {
      it('should return undefined', () => {
        expect(post.getPieceRateAtDate(pieceRate1day.subDays(1))).toBeUndefined();
      });
    });

    context('when day equal second pieceRate day', () => {
      it('should return second pieceRate\'s value', () => {
        expect(post.getPieceRateAtDate(pieceRate2day)).toBe(pieceRate2value);
      });
    });

    context('when day after third pieceRate day', () => {
      it('should return third pieceRate\'s value', () => {
        expect(post.getPieceRateAtDate(newDay)).toBe(pieceRate3value);
      });
    });
  });
});
