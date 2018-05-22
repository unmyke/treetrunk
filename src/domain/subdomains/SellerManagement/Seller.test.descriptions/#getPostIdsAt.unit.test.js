import { SellerId, PostId, Day } from '../../../commonTypes';
import { Seller } from '../Seller';
import { Post } from '../Post';

const lastName = 'lastName';
const firstName = 'Firstname';
const middleName = 'Middlename';
const phone = '55-66-00';

const floristPost = new Post({ name: 'Флорист' });
const seniorFloristPost = new Post({ name: 'Старший флорист' });

const newDay = new Day();
const day1 = new Day({ value: new Date('2017.01.14 00:00.000+08:00') });
const day2 = new Day({ value: new Date('2017.02.20 00:00.000+08:00') });
const day3 = new Day({ value: new Date('2017.03.14 00:00.000+08:00') });
const day4 = new Day({ value: new Date('2017.04.16 00:00.000+08:00') });
const day5 = new Day({ value: new Date('2017.05.18 00:00.000+08:00') });
const day6 = new Day({ value: new Date('2017.06.01 00:00.000+08:00') });
const day7 = new Day({ value: new Date('2017.07.01 00:00.000+08:00') });
const day8 = new Day({ value: new Date('2017.08.01 00:00.000+08:00') });
const day9 = new Day({ value: new Date('2017.09.01 00:00.000+08:00') });
const day10 = new Day({ value: new Date('2017.10.01 00:00.000+08:00') });

const quitPostId = new PostId();
PostId.quitPostId = quitPostId;

describe('Domain :: entities :: Seller :: #getPostIdsAt', () => {
  let seller;
  beforeEach(() => {
    seller = new Seller({ lastName, firstName, middleName, phone });
  });

  context('when seller have no appointments', () => {
    context('when passed custom day', () => {
      test('should return empty array', () => {
        expect(seller.getPostIdsAt(day1)).toEqual([]);
      });
    });

    context('when no props passed', () => {
      test('should return empty array', () => {
        expect(seller.getPostIdsAt()).toEqual([]);
      });
    });
  });

  context('when seller have appointments and not quited', () => {
    beforeEach(() => {
      seller.setAppointments([
        { postId: floristPost.postId, day: day2 },
        { postId: seniorFloristPost.postId, day: day4 },
      ]);
    });
    context('when passed day before appointments', () => {
      test('should return empty array', () => {
        expect(seller.getPostIdsAt(day1)).toEqual([]);
      });
    });
    context('when passed day of first appointment', () => {
      test('should return array with first appointment postId', () => {
        expect(seller.getPostIdsAt(day2)).toEqual([floristPost.postId]);
      });
    });
    context('when passed day between first and second appointments', () => {
      test('should return array with first appointment postId', () => {
        expect(seller.getPostIdsAt(day3)).toEqual([floristPost.postId]);
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return array with all postIds between first appointment and passed day', () => {
        expect(seller.getPostIdsAt(day4)).toEqual([
          floristPost.postId,
          seniorFloristPost.postId,
        ]);
      });
    });
    context('when no props passed', () => {
      test('should return array with all postIds between first appointment and passed day', () => {
        expect(seller.getPostIdsAt()).toEqual([
          floristPost.postId,
          seniorFloristPost.postId,
        ]);
      });
    });
  });

  context('when seller have quited', () => {
    beforeEach(() => {
      seller.setAppointments([
        { postId: floristPost.postId, day: day2 },
        { postId: seniorFloristPost.postId, day: day4 },
        { postId: quitPostId, day: day6 },
      ]);
    });
    context('when passed day before appointments', () => {
      test('should return empty array', () => {
        expect(seller.getPostIdsAt(day1)).toEqual([]);
      });
    });
    context('when passed day of first appointment', () => {
      test('should return array with first appointment postId', () => {
        expect(seller.getPostIdsAt(day2)).toEqual([floristPost.postId]);
      });
    });
    context('when passed day between first and second appointments', () => {
      test('should return array with first appointment postId', () => {
        expect(seller.getPostIdsAt(day3)).toEqual([floristPost.postId]);
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return array with all postIds between first appointment and passed day', () => {
        expect(seller.getPostIdsAt(day4)).toEqual([
          floristPost.postId,
          seniorFloristPost.postId,
        ]);
      });
    });
    context('when passed day between last appointment and quit', () => {
      test('should return array with all postIds between first appointment and passed day', () => {
        expect(seller.getPostIdsAt(day5)).toEqual([
          floristPost.postId,
          seniorFloristPost.postId,
        ]);
      });
    });
    context('when passed quit day', () => {
      test('should return empty array', () => {
        expect(seller.getPostIdsAt(day6)).toEqual([]);
      });
    });
    context('when no props passed', () => {
      test('should return empty array', () => {
        expect(seller.getPostIdsAt()).toEqual([]);
      });
    });
  });

  context('when seller have quited and recruited again', () => {
    beforeEach(() => {
      seller.setAppointments([
        { postId: floristPost.postId, day: day2 },
        { postId: seniorFloristPost.postId, day: day4 },
        { postId: quitPostId, day: day6 },
        { postId: seniorFloristPost.postId, day: day8 },
      ]);
    });
    context('when passed day before appointments', () => {
      test('should return empty array', () => {
        expect(seller.getPostIdsAt(day1)).toEqual([]);
      });
    });
    context('when passed day of first appointment', () => {
      test('should return array with first appointment postId', () => {
        expect(seller.getPostIdsAt(day2)).toEqual([floristPost.postId]);
      });
    });
    context('when passed day between first and second appointments', () => {
      test('should return array with first appointment postId', () => {
        expect(seller.getPostIdsAt(day3)).toEqual([floristPost.postId]);
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return array with all postIds between first appointment and passed day', () => {
        expect(seller.getPostIdsAt(day4)).toEqual([
          floristPost.postId,
          seniorFloristPost.postId,
        ]);
      });
    });
    context('when passed day between last appointment and quit', () => {
      test('should return array with all postIds between first appointment and passed day', () => {
        expect(seller.getPostIdsAt(day5)).toEqual([
          floristPost.postId,
          seniorFloristPost.postId,
        ]);
      });
    });
    context('when passed quit day', () => {
      test('should return empty array', () => {
        expect(seller.getPostIdsAt(day6)).toEqual([]);
      });
    });
    context('when passed day between quit and second recruit', () => {
      test('should return empty array', () => {
        expect(seller.getPostIdsAt(7)).toEqual([]);
      });
    });
    context('when passed second recruit day', () => {
      test('should return array with postId of second recruit', () => {
        expect(seller.getPostIdsAt(day8)).toEqual([seniorFloristPost.postId]);
      });
    });
    context('when no props passed', () => {
      test('should return array with all postIds between first appointment and today', () => {
        expect(seller.getPostIdsAt()).toEqual([seniorFloristPost.postId]);
      });
    });
  });

  context('when seller have quited, recruited again and quit again', () => {
    beforeEach(() => {
      seller.setAppointments([
        { postId: floristPost.postId, day: day2 },
        { postId: seniorFloristPost.postId, day: day4 },
        { postId: quitPostId, day: day6 },
        { postId: seniorFloristPost.postId, day: day8 },
        { postId: quitPostId, day: day10 },
      ]);
    });
    context('when passed day before appointments', () => {
      test('should return empty array', () => {
        expect(seller.getPostIdsAt(day1)).toEqual([]);
      });
    });
    context('when passed day of first appointment', () => {
      test('should return array with first appointment postId', () => {
        expect(seller.getPostIdsAt(day2)).toEqual([floristPost.postId]);
      });
    });
    context('when passed day between first and second appointments', () => {
      test('should return array with first appointment postId', () => {
        expect(seller.getPostIdsAt(day3)).toEqual([floristPost.postId]);
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return array with all postIds between first appointment and passed day', () => {
        expect(seller.getPostIdsAt(day4)).toEqual([
          floristPost.postId,
          seniorFloristPost.postId,
        ]);
      });
    });
    context('when passed day between last appointment and quit', () => {
      test('should return array with all postIds between first appointment and passed day', () => {
        expect(seller.getPostIdsAt(day5)).toEqual([
          floristPost.postId,
          seniorFloristPost.postId,
        ]);
      });
    });
    context('when passed quit day', () => {
      test('should return empty array', () => {
        expect(seller.getPostIdsAt(day6)).toEqual([]);
      });
    });
    context('when passed day between quit and second recruit', () => {
      test('should return empty array', () => {
        expect(seller.getPostIdsAt(7)).toEqual([]);
      });
    });
    context('when passed second recruit day', () => {
      test('should return array with postId of second recruit', () => {
        expect(seller.getPostIdsAt(day8)).toEqual([seniorFloristPost.postId]);
      });
    });
    context('when passed day after second recruit day', () => {
      test('should return array with all postIds between first appointment and passed day', () => {
        expect(seller.getPostIdsAt(day9)).toEqual([seniorFloristPost.postId]);
      });
    });
    context('when passed second quit day', () => {
      test('should return empty array', () => {
        expect(seller.getPostIdsAt(day10)).toEqual([]);
      });
    });
    context('when no props passed', () => {
      test('should return empty array', () => {
        expect(seller.getPostIdsAt()).toEqual([]);
      });
    });
  });
});
