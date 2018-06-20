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

const dismissPostId = new PostId();
PostId.dismissPostId = dismissPostId;

describe('Domain :: entities :: Seller :: #isDismissedAt', () => {
  let seller;
  beforeEach(() => {
    seller = new Seller({ lastName, firstName, middleName, phone });
  });

  context('when seller have no appointments', () => {
    context('when passed custom day', () => {
      test('should return false', () => {
        expect(seller.isDismissedAt(day1)).toBeFalsy();
      });
    });

    context('when no props passed', () => {
      test('should return false', () => {
        expect(seller.isDismissedAt()).toBeFalsy();
      });
    });
  });

  context('when seller have appointments and not dismissed', () => {
    beforeEach(() => {
      seller.setAppointments([
        { postId: floristPost.postId, day: day2 },
        { postId: seniorFloristPost.postId, day: day4 },
      ]);
    });
    context('when passed day before appointments', () => {
      test('should return false', () => {
        expect(seller.isDismissedAt(day1)).toBeFalsy();
      });
    });
    context('when passed day of first appointment', () => {
      test('should return false', () => {
        expect(seller.isDismissedAt(day2)).toBeFalsy();
      });
    });
    context('when passed day between first and second appointments', () => {
      test('should return false', () => {
        expect(seller.isDismissedAt(day3)).toBeFalsy();
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return false', () => {
        expect(seller.isDismissedAt(day4)).toBeFalsy();
      });
    });
    context('when no props passed', () => {
      test('should return false', () => {
        expect(seller.isDismissedAt()).toBeFalsy();
      });
    });
  });

  context('when seller have dismissed', () => {
    beforeEach(() => {
      seller.setAppointments([
        { postId: floristPost.postId, day: day2 },
        { postId: seniorFloristPost.postId, day: day4 },
        { postId: dismissPostId, day: day6 },
      ]);
    });
    context('when passed day before appointments', () => {
      test('should return false', () => {
        expect(seller.isDismissedAt(day1)).toBeFalsy();
      });
    });
    context('when passed day of first appointment', () => {
      test('should return false', () => {
        expect(seller.isDismissedAt(day2)).toBeFalsy();
      });
    });
    context('when passed day between first and second appointments', () => {
      test('should return false', () => {
        expect(seller.isDismissedAt(day3)).toBeFalsy();
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return false', () => {
        expect(seller.isDismissedAt(day4)).toBeFalsy();
      });
    });
    context('when passed day between last appointment and dismiss', () => {
      test('should return false', () => {
        expect(seller.isDismissedAt(day5)).toBeFalsy();
      });
    });
    context('when passed dismiss day', () => {
      test('should return true', () => {
        expect(seller.isDismissedAt(day6)).toBeTruthy();
      });
    });
    context('when no props passed', () => {
      test('should return true', () => {
        expect(seller.isDismissedAt()).toBeTruthy();
      });
    });
  });

  context('when seller have dismissed and recruited again', () => {
    beforeEach(() => {
      seller.setAppointments([
        { postId: floristPost.postId, day: day2 },
        { postId: seniorFloristPost.postId, day: day4 },
        { postId: dismissPostId, day: day6 },
        { postId: seniorFloristPost.postId, day: day8 },
      ]);
    });
    context('when passed day before appointments', () => {
      test('should return false', () => {
        expect(seller.isDismissedAt(day1)).toBeFalsy();
      });
    });
    context('when passed day of first appointment', () => {
      test('should return false', () => {
        expect(seller.isDismissedAt(day2)).toBeFalsy();
      });
    });
    context('when passed day between first and second appointments', () => {
      test('should return false', () => {
        expect(seller.isDismissedAt(day3)).toBeFalsy();
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return false', () => {
        expect(seller.isDismissedAt(day4)).toBeFalsy();
      });
    });
    context('when passed day between last appointment and dismiss', () => {
      test('should return false', () => {
        expect(seller.isDismissedAt(day5)).toBeFalsy();
      });
    });
    context('when passed dismiss day', () => {
      test('should return true', () => {
        expect(seller.isDismissedAt(day6)).toBeTruthy();
      });
    });
    context('when passed day between dismiss and second recruit', () => {
      test('should return true', () => {
        expect(seller.isDismissedAt(day7)).toBeTruthy();
      });
    });
    context('when passed second recruit day', () => {
      test('should return false', () => {
        expect(seller.isDismissedAt(day8)).toBeFalsy();
      });
    });
    context('when no props passed', () => {
      test('should return false', () => {
        expect(seller.isDismissedAt()).toBeFalsy();
      });
    });
  });

  context(
    'when seller have dismissed, recruited again and dismiss again',
    () => {
      beforeEach(() => {
        seller.setAppointments([
          { postId: floristPost.postId, day: day2 },
          { postId: seniorFloristPost.postId, day: day4 },
          { postId: dismissPostId, day: day6 },
          { postId: seniorFloristPost.postId, day: day8 },
          { postId: dismissPostId, day: day10 },
        ]);
      });
      context('when passed day before appointments', () => {
        test('should return false', () => {
          expect(seller.isDismissedAt(day1)).toBeFalsy();
        });
      });
      context('when passed day of first appointment', () => {
        test('should return false', () => {
          expect(seller.isDismissedAt(day2)).toBeFalsy();
        });
      });
      context('when passed day between first and second appointments', () => {
        test('should return false', () => {
          expect(seller.isDismissedAt(day3)).toBeFalsy();
        });
      });
      context('when passed day of appointment after first', () => {
        test('should return false', () => {
          expect(seller.isDismissedAt(day4)).toBeFalsy();
        });
      });
      context('when passed day between last appointment and dismiss', () => {
        test('should return false', () => {
          expect(seller.isDismissedAt(day5)).toBeFalsy();
        });
      });
      context('when passed dismiss day', () => {
        test('should return true', () => {
          expect(seller.isDismissedAt(day6)).toBeTruthy();
        });
      });
      context('when passed day between dismiss and second recruit', () => {
        test('should return true', () => {
          expect(seller.isDismissedAt(day7)).toBeTruthy();
        });
      });
      context('when passed second recruit day', () => {
        test('should return false', () => {
          expect(seller.isDismissedAt(day8)).toBeFalsy();
        });
      });
      context('when passed day after second recruit day', () => {
        test('should return false', () => {
          expect(seller.isDismissedAt(day9)).toBeFalsy();
        });
      });
      context('when passed second dismiss day', () => {
        test('should return second dismiss day', () => {
          expect(seller.isDismissedAt(day10)).toBeTruthy();
        });
      });
      context('when no props passed', () => {
        test('should return second dismiss day', () => {
          expect(seller.isDismissedAt()).toBeTruthy();
        });
      });
    }
  );
});
