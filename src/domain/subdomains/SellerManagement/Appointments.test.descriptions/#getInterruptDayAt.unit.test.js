import { PostId, Day } from '../../../commonTypes';

import { Appointments } from '../Appointments';

const value1 = new PostId();
const value2 = new PostId();

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

const closeValue = new PostId();

describe('Domain :: entities :: Appointments :: #getCloseDayAt', () => {
  let valueDayProgress;
  beforeEach(() => {
    valueDayProgress = new Appointments({});
  });

  context('when valueDayProgress have no appointments', () => {
    context('when passed custom day', () => {
      test('should return undefined', () => {
        expect(valueDayProgress.getCloseDayAt(day1)).toBeUndefined();
      });
    });

    context('when no props passed', () => {
      test('should return undefined', () => {
        expect(valueDayProgress.getCloseDayAt()).toBeUndefined();
      });
    });
  });

  context('when valueDayProgress have appointments and not closeed', () => {
    beforeEach(() => {
      valueDayProgress.setAppointments([
        new Appointment({ postId: value1, day: day2 }),
        new Appointment({ postId: value2, day: day4 }),
      ]);
    });
    context('when passed day before appointments', () => {
      test('should return undefined', () => {
        expect(valueDayProgress.getCloseDayAt(day1)).toBeUndefined();
      });
    });
    context('when passed day of first appointment', () => {
      test('should return undefined', () => {
        expect(valueDayProgress.getCloseDayAt(day2)).toBeUndefined();
      });
    });
    context('when passed day between first and second appointments', () => {
      test('should return undefined', () => {
        expect(valueDayProgress.getCloseDayAt(day3)).toBeUndefined();
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return undefined', () => {
        expect(valueDayProgress.getCloseDayAt(day4)).toBeUndefined();
      });
    });
    context('when no props passed', () => {
      test('should return undefined', () => {
        expect(valueDayProgress.getCloseDayAt()).toBeUndefined();
      });
    });
  });

  context('when valueDayProgress have closeed', () => {
    beforeEach(() => {
      valueDayProgress.setAppointments([
        new Appointment({ postId: value1, day: day2 }),
        new Appointment({ postId: value2, day: day4 }),
        new Appointment({ postId: closeValue, day: day6 }),
      ]);
    });
    context('when passed day before appointments', () => {
      test('should return undefined', () => {
        expect(valueDayProgress.getCloseDayAt(day1)).toBeUndefined();
      });
    });
    context('when passed day of first appointment', () => {
      test('should return undefined', () => {
        expect(valueDayProgress.getCloseDayAt(day2)).toBeUndefined();
      });
    });
    context('when passed day between first and second appointments', () => {
      test('should return undefined', () => {
        expect(valueDayProgress.getCloseDayAt(day3)).toBeUndefined();
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return undefined', () => {
        expect(valueDayProgress.getCloseDayAt(day4)).toBeUndefined();
      });
    });
    context('when passed day between last appointment and close', () => {
      test('should return undefined', () => {
        expect(valueDayProgress.getCloseDayAt(day5)).toBeUndefined();
      });
    });
    context('when passed close day', () => {
      test('should return close day', () => {
        expect(valueDayProgress.getCloseDayAt(day6)).toBe(day6);
      });
    });
    context('when no props passed', () => {
      test('should return close day', () => {
        expect(valueDayProgress.getCloseDayAt()).toBe(day6);
      });
    });
  });

  context('when valueDayProgress have closeed and recruited again', () => {
    beforeEach(() => {
      valueDayProgress.setAppointments([
        new Appointment({ postId: value1, day: day2 }),
        new Appointment({ postId: value2, day: day4 }),
        new Appointment({ postId: closeValue, day: day6 }),
        new Appointment({ postId: value2, day: day8 }),
      ]);
    });
    context('when passed day before appointments', () => {
      test('should return undefined', () => {
        expect(valueDayProgress.getCloseDayAt(day1)).toBeUndefined();
      });
    });
    context('when passed day of first appointment', () => {
      test('should return undefined', () => {
        expect(valueDayProgress.getCloseDayAt(day2)).toBeUndefined();
      });
    });
    context('when passed day between first and second appointments', () => {
      test('should return undefined', () => {
        expect(valueDayProgress.getCloseDayAt(day3)).toBeUndefined();
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return undefined', () => {
        expect(valueDayProgress.getCloseDayAt(day4)).toBeUndefined();
      });
    });
    context('when passed day between last appointment and close', () => {
      test('should return undefined', () => {
        expect(valueDayProgress.getCloseDayAt(day5)).toBeUndefined();
      });
    });
    context('when passed close day', () => {
      test('should return close day', () => {
        expect(valueDayProgress.getCloseDayAt(day6)).toBe(day6);
      });
    });
    context('when passed day between close and second recruit', () => {
      test('should return close day', () => {
        expect(valueDayProgress.getCloseDayAt(day7)).toBe(day6);
      });
    });
    context('when passed second recruit day', () => {
      test('should return undefined', () => {
        expect(valueDayProgress.getCloseDayAt(day8)).toBeUndefined();
      });
    });
    context('when no props passed', () => {
      test('should return undefined', () => {
        expect(valueDayProgress.getCloseDayAt()).toBeUndefined();
      });
    });
  });

  context(
    'when valueDayProgress have closeed, recruited again and close again',
    () => {
      beforeEach(() => {
        valueDayProgress.setAppointments([
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
          new Appointment({ postId: closeValue, day: day6 }),
          new Appointment({ postId: value2, day: day8 }),
          new Appointment({ postId: closeValue, day: day10 }),
        ]);
      });
      context('when passed day before appointments', () => {
        test('should return undefined', () => {
          expect(valueDayProgress.getCloseDayAt(day1)).toBeUndefined();
        });
      });
      context('when passed day of first appointment', () => {
        test('should return undefined', () => {
          expect(valueDayProgress.getCloseDayAt(day2)).toBeUndefined();
        });
      });
      context('when passed day between first and second appointments', () => {
        test('should return undefined', () => {
          expect(valueDayProgress.getCloseDayAt(day3)).toBeUndefined();
        });
      });
      context('when passed day of appointment after first', () => {
        test('should return undefined', () => {
          expect(valueDayProgress.getCloseDayAt(day4)).toBeUndefined();
        });
      });
      context('when passed day between last appointment and close', () => {
        test('should return undefined', () => {
          expect(valueDayProgress.getCloseDayAt(day5)).toBeUndefined();
        });
      });
      context('when passed close day', () => {
        test('should return close day', () => {
          expect(valueDayProgress.getCloseDayAt(day6)).toBe(day6);
        });
      });
      context('when passed day between close and second recruit', () => {
        test('should return close day', () => {
          expect(valueDayProgress.getCloseDayAt(day7)).toBe(day6);
        });
      });
      context('when passed second recruit day', () => {
        test('should return undefined', () => {
          expect(valueDayProgress.getCloseDayAt(day8)).toBeUndefined();
        });
      });
      context('when passed day after second recruit day', () => {
        test('should return undefined', () => {
          expect(valueDayProgress.getCloseDayAt(day9)).toBeUndefined();
        });
      });
      context('when passed second close day', () => {
        test('should return second close day', () => {
          expect(valueDayProgress.getCloseDayAt(day10)).toBe(day10);
        });
      });
      context('when no props passed', () => {
        test('should return second close day', () => {
          expect(valueDayProgress.getCloseDayAt()).toBe(day10);
        });
      });
    }
  );
});
