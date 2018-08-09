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
const day1 = new Day({ value: new Date('2017.01.01 00:00.000+08:00') });
const day2 = new Day({ value: new Date('2017.02.01 00:00.000+08:00') });
const day3 = new Day({ value: new Date('2017.03.01 00:00.000+08:00') });
const day4 = new Day({ value: new Date('2017.04.01 00:00.000+08:00') });
const day5 = new Day({ value: new Date('2017.05.01 00:00.000+08:00') });
const day6 = new Day({ value: new Date('2017.06.01 00:00.000+08:00') });
const day7 = new Day({ value: new Date('2017.07.01 00:00.000+08:00') });
const day8 = new Day({ value: new Date('2017.08.01 00:00.000+08:00') });
const day9 = new Day({ value: new Date('2017.09.01 00:00.000+08:00') });
const day10 = new Day({ value: new Date('2017.10.01 00:00.000+08:00') });

const dismissPostId = new PostId();
PostId.dismissPostId = dismissPostId;

describe('Domain :: entities :: Seller :: #getSeniorityAt', () => {
  let seller;
  beforeEach(() => {
    seller = new Seller({ lastName, firstName, middleName, phone });
  });

  context('when seller have no appointments', () => {
    context('when passed custom day', () => {
      test('should return undefined', () => {
        expect(seller.getSeniorityAt(day1)).toBeUndefined();
      });
    });

    context('when no props passed', () => {
      test('should return undefined', () => {
        expect(seller.getSeniorityAt()).toBeUndefined();
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
      test('should return undefined', () => {
        expect(seller.getSeniorityAt(day1)).toBeUndefined();
      });
    });
    context('when passed day of first appointment', () => {
      test('should return 0', () => {
        expect(seller.getSeniorityAt(day2)).toBe(0);
      });
    });
    context('when passed one month later recruit day', () => {
      test('should return 1', () => {
        expect(seller.getSeniorityAt(day3)).toBe(1);
      });
    });
    context('when passed two month later recruit day', () => {
      test('should return 2', () => {
        expect(seller.getSeniorityAt(day4)).toBe(2);
      });
    });
    context('when no props passed', () => {
      test('should return month count between recruit day and today', () => {
        expect(seller.getSeniorityAt()).toBe(-day2.differenceInMonths());
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
      test('should return undefined', () => {
        expect(seller.getSeniorityAt(day1)).toBeUndefined();
      });
    });
    context('when passed day of first appointment', () => {
      test('should return 0', () => {
        expect(seller.getSeniorityAt(day2)).toBe(0);
      });
    });
    context('when passed one month later recruit day', () => {
      test('should return 1', () => {
        expect(seller.getSeniorityAt(day3)).toBe(1);
      });
    });
    context('when passed two month later recruit day', () => {
      test('should return 2', () => {
        expect(seller.getSeniorityAt(day4)).toBe(2);
      });
    });
    context(
      'when passed day between last appointment and dismiss (3 month later recruit day)',
      () => {
        test('should return 3', () => {
          expect(seller.getSeniorityAt(day5)).toBe(3);
        });
      }
    );
    context('when passed dismiss day', () => {
      test('should return undefined', () => {
        expect(seller.getSeniorityAt(day6)).toBeUndefined();
      });
    });
    context('when no props passed', () => {
      test('should return undefined', () => {
        expect(seller.getSeniorityAt()).toBeUndefined();
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
      test('should return undefined', () => {
        expect(seller.getSeniorityAt(day1)).toBeUndefined();
      });
    });
    context('when passed day of first appointment', () => {
      test('should return 0', () => {
        expect(seller.getSeniorityAt(day2)).toBe(0);
      });
    });
    context('when passed one month later recruit day', () => {
      test('should return 1', () => {
        expect(seller.getSeniorityAt(day3)).toBe(1);
      });
    });
    context('when passed two month later recruit day', () => {
      test('should return 2', () => {
        expect(seller.getSeniorityAt(day4)).toBe(2);
      });
    });
    context(
      'when passed day between last appointment and dismiss (3 month later recruit day)',
      () => {
        test('should return 3', () => {
          expect(seller.getSeniorityAt(day5)).toBe(3);
        });
      }
    );
    context('when passed dismiss day', () => {
      test('should return undefined', () => {
        expect(seller.getSeniorityAt(day6)).toBeUndefined();
      });
    });
    context('when passed day between dismiss and second recruit', () => {
      test('should return undefined', () => {
        expect(seller.getSeniorityAt(day7)).toBeUndefined();
      });
    });
    context('when passed second recruit day', () => {
      test('should return 0', () => {
        expect(seller.getSeniorityAt(day8)).toBe(0);
      });
    });
    context('when no props passed', () => {
      test('should return month count between second recruit day and today', () => {
        expect(seller.getSeniorityAt()).toBe(-day8.differenceInMonths());
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
        test('should return undefined', () => {
          expect(seller.getSeniorityAt(day1)).toBeUndefined();
        });
      });
      context('when passed day of first appointment', () => {
        test('should return 0', () => {
          expect(seller.getSeniorityAt(day2)).toBe(0);
        });
      });
      context('when passed one month later recruit day', () => {
        test('should return 1', () => {
          expect(seller.getSeniorityAt(day3)).toBe(1);
        });
      });
      context('when passed two month later recruit day', () => {
        test('should return 2', () => {
          expect(seller.getSeniorityAt(day4)).toBe(2);
        });
      });
      context(
        'when passed day between last appointment and dismiss (3 month later recruit day)',
        () => {
          test('should return 3', () => {
            expect(seller.getSeniorityAt(day5)).toBe(3);
          });
        }
      );
      context('when passed dismiss day', () => {
        test('should return undefined', () => {
          expect(seller.getSeniorityAt(day6)).toBeUndefined();
        });
      });
      context('when passed day between dismiss and second recruit', () => {
        test('should return undefined', () => {
          expect(seller.getSeniorityAt(day7)).toBeUndefined();
        });
      });
      context('when passed second recruit day', () => {
        test('should return 0', () => {
          expect(seller.getSeniorityAt(day8)).toBe(0);
        });
      });
      context('when passed day one month later second recruit day', () => {
        test('should return 1', () => {
          expect(seller.getSeniorityAt(day9)).toBe(1);
        });
      });
      context('when passed second dismiss day', () => {
        test('should return undefined', () => {
          expect(seller.getSeniorityAt(day10)).toBeUndefined();
        });
      });
      context('when no props passed', () => {
        test('should return undefined', () => {
          expect(seller.getSeniorityAt()).toBeUndefined();
        });
      });
    }
  );
});
