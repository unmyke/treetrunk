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

describe('Domain :: entities :: Seller :: #getRecruitDayAt', () => {
  let seller;
  beforeEach(() => {
    seller = new Seller({ lastName, firstName, middleName, phone });
  });

  context('when seller have no appointments', () => {
    context('when passed custom day', () => {
      test('should return undefined', () => {
        expect(seller.getRecruitDayAt(day1)).toBeUndefined();
      });
    });

    context('when no props passed', () => {
      test('should return undefined', () => {
        expect(seller.getRecruitDayAt()).toBeUndefined();
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
      test('should return undefined', () => {
        expect(seller.getRecruitDayAt(day1)).toBeUndefined();
      });
    });
    context('when passed day of first appointment', () => {
      test('should return day of first appointment', () => {
        expect(seller.getRecruitDayAt(day2)).toBe(day2);
      });
    });
    context('when passed day between first and second appointments', () => {
      test('should return day of first appointment', () => {
        expect(seller.getRecruitDayAt(day3)).toBe(day2);
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return day of first appointment', () => {
        expect(seller.getRecruitDayAt(day4)).toBe(day2);
      });
    });
    context('when no props passed', () => {
      test('should return day of first appointment', () => {
        expect(seller.getRecruitDayAt()).toBe(day2);
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
      test('should return undefined', () => {
        expect(seller.getRecruitDayAt(day1)).toBeUndefined();
      });
    });
    context('when passed day of first appointment', () => {
      test('should return day of first appointment', () => {
        expect(seller.getRecruitDayAt(day2)).toBe(day2);
      });
    });
    context('when passed day between first and second appointments', () => {
      test('should return day of first appointment', () => {
        expect(seller.getRecruitDayAt(day3)).toBe(day2);
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return day of first appointment', () => {
        expect(seller.getRecruitDayAt(day4)).toBe(day2);
      });
    });
    context('when passed day between last appointment and quit', () => {
      test('should return day of first appointment', () => {
        expect(seller.getRecruitDayAt(day5)).toBe(day2);
      });
    });
    context('when passed quit day', () => {
      test('should return undefined', () => {
        expect(seller.getRecruitDayAt(day6)).toBeUndefined();
      });
    });
    context('when no props passed', () => {
      test('should return undefined', () => {
        expect(seller.getRecruitDayAt()).toBeUndefined();
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
      test('should return undefined', () => {
        expect(seller.getRecruitDayAt(day1)).toBeUndefined();
      });
    });
    context('when passed day of first appointment', () => {
      test('should return day of first appointment', () => {
        expect(seller.getRecruitDayAt(day2)).toBe(day2);
      });
    });
    context('when passed day between first and second appointments', () => {
      test('should return day of first appointment', () => {
        expect(seller.getRecruitDayAt(day3)).toBe(day2);
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return day of first appointment', () => {
        expect(seller.getRecruitDayAt(day4)).toBe(day2);
      });
    });
    context('when passed day between last appointment and quit', () => {
      test('should return day of first appointment', () => {
        expect(seller.getRecruitDayAt(day5)).toBe(day2);
      });
    });
    context('when passed quit day', () => {
      test('should return undefined', () => {
        expect(seller.getRecruitDayAt(day6)).toBeUndefined();
      });
    });
    context('when passed day between quit and second recruit', () => {
      test('should return undefined', () => {
        expect(seller.getRecruitDayAt(day7)).toBeUndefined();
      });
    });
    context('when passed second recruit day', () => {
      test('should return day of second recruit', () => {
        expect(seller.getRecruitDayAt(day8)).toBe(day8);
      });
    });
    context('when no props passed', () => {
      test('should return day of second recruit', () => {
        expect(seller.getRecruitDayAt()).toBe(day8);
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
      test('should return undefined', () => {
        expect(seller.getRecruitDayAt(day1)).toBeUndefined();
      });
    });
    context('when passed day of first appointment', () => {
      test('should return day of first appointment', () => {
        expect(seller.getRecruitDayAt(day2)).toBe(day2);
      });
    });
    context('when passed day between first and second appointments', () => {
      test('should return day of first appointment', () => {
        expect(seller.getRecruitDayAt(day3)).toBe(day2);
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return day of first appointment', () => {
        expect(seller.getRecruitDayAt(day4)).toBe(day2);
      });
    });
    context('when passed day between last appointment and quit', () => {
      test('should return day of first appointment', () => {
        expect(seller.getRecruitDayAt(day5)).toBe(day2);
      });
    });
    context('when passed quit day', () => {
      test('should return undefined', () => {
        expect(seller.getRecruitDayAt(day6)).toBeUndefined();
      });
    });
    context('when passed day between quit and second recruit', () => {
      test('should return undefined', () => {
        expect(seller.getRecruitDayAt(day7)).toBeUndefined();
      });
    });
    context('when passed second recruit day', () => {
      test('should return day of second recruit', () => {
        expect(seller.getRecruitDayAt(day8)).toBe(day8);
      });
    });
    context('when passed day after second recruit day', () => {
      test('should return day of second recruit', () => {
        expect(seller.getRecruitDayAt(day9)).toBe(day8);
      });
    });
    context('when passed second quit day', () => {
      test('should return undefined', () => {
        expect(seller.getRecruitDayAt(day10)).toBeUndefined();
      });
    });
    context('when no props passed', () => {
      test('should return undefined', () => {
        expect(seller.getRecruitDayAt()).toBeUndefined();
      });
    });
  });
});
