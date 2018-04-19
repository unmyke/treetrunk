import { subDays, startOfDay } from 'date-fns';
import { Post } from './Post';
import { PostId } from './PostId';
import { PieceRate } from './PieceRate';

const name = 'Флорист';

const pieceRate1value = 4;
const pieceRate2value = 2;
const pieceRate3value = 5.5;

const pieceRate1date = new Date('2018.01.14 11:00');
const pieceRate2date = new Date('2018.02.20 11:00');
const pieceRate3date = new Date('2018.03.14 11:00');

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
        post.addPieceRate(pieceRate1value, pieceRate1date);

        expect(post.pieceRates).toHaveLength(1);
      });
    });

    context('when add to same value by same date', () => {
      it('should throw exeption', () => {
        post.addPieceRate(pieceRate1value, pieceRate1date);

        try {
          post.addPieceRate(pieceRate1value, pieceRate1date);
        }
        catch(e) {
          expect(e.details).toEqual(['Post already have this pieceRate']);
          expect(post.pieceRates).toHaveLength(1);
        }
      });
    });

    context('when add to same value, different date, but previous value is same', () => {
      it('should throw exeption', () => {
        post.addPieceRate(pieceRate1value, pieceRate1date);

        try {
          post.addPieceRate(pieceRate1value, new Date());
        }
        catch(e) {
          expect(e.details).toEqual(['Post already have this pieceRate']);
          expect(post.pieceRates).toHaveLength(1);
        }
      });
    });

    context('when add to different value, different date, but previous value is same', () => {
      it('should have pieceRates length qual 2', () => {
        post.addPieceRate(pieceRate2value, pieceRate2date);
        post.addPieceRate(pieceRate1value, pieceRate1date);

        expect(post.pieceRates).toHaveLength(2);
      });
    });
  });

  describe('#getPieceRateAtDate', () => {
    beforeEach(() => {
      post.addPieceRate(pieceRate2value, pieceRate2date);
      post.addPieceRate(pieceRate3value, pieceRate3date);
      post.addPieceRate(pieceRate1value, pieceRate1date);
    });

    context('when date before first pieceRate', () => {
      it('should return undefined', () => {
        expect(post.getPieceRateAtDate(subDays(pieceRate1date, 1))).toBeUndefined();
      });
    });

    context('when date equal second pieceRate date', () => {
      it('should return second pieceRate\'s value', () => {
        expect(post.getPieceRateAtDate(pieceRate2date)).toBe(pieceRate2value);
      });
    });

    context('when date after third pieceRate date', () => {
      it('should return third pieceRate\'s value', () => {
        expect(post.getPieceRateAtDate(new Date())).toBe(pieceRate3value);
      });
    });
  });
});
