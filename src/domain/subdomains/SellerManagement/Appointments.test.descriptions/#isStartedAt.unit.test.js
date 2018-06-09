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

describe('Domain :: entities :: Appointments :: #isRecruitedAt', () => {
  let valueDayProgress;
  beforeEach(() => {
    valueDayProgress = new Appointments({});
  });

  context('when valueDayProgress have no appointments', () => {
    context('when passed custom day', () => {
      test('should return false', () => {
        expect(valueDayProgress.isRecruitedAt(day1)).toBeFalsy();
      });
    });

    context('when no props passed', () => {
      test('should return false', () => {
        expect(valueDayProgress.isRecruitedAt()).toBeFalsy();
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
      test('should return false', () => {
        expect(valueDayProgress.isRecruitedAt(day1)).toBeFalsy();
      });
    });
    context('when passed day of first appointment', () => {
      test('should return true', () => {
        expect(valueDayProgress.isRecruitedAt(day2)).toBeTruthy();
      });
    });
    context('when passed day between first and second appointments', () => {
      test('should return true', () => {
        expect(valueDayProgress.isRecruitedAt(day3)).toBeTruthy();
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return true', () => {
        expect(valueDayProgress.isRecruitedAt(day4)).toBeTruthy();
      });
    });
    context('when no props passed', () => {
      test('should return true', () => {
        expect(valueDayProgress.isRecruitedAt()).toBeTruthy();
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
      test('should return false', () => {
        expect(valueDayProgress.isRecruitedAt(day1)).toBeFalsy();
      });
    });
    context('when passed day of first appointment', () => {
      test('should return true', () => {
        expect(valueDayProgress.isRecruitedAt(day2)).toBeTruthy();
      });
    });
    context('when passed day between first and second appointments', () => {
      test('should return true', () => {
        expect(valueDayProgress.isRecruitedAt(day3)).toBeTruthy();
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return true', () => {
        expect(valueDayProgress.isRecruitedAt(day4)).toBeTruthy();
      });
    });
    context('when passed day between last appointment and close', () => {
      test('should return true', () => {
        expect(valueDayProgress.isRecruitedAt(day5)).toBeTruthy();
      });
    });
    context('when passed close day', () => {
      test('should return false', () => {
        expect(valueDayProgress.isRecruitedAt(day6)).toBeFalsy();
      });
    });
    context('when no props passed', () => {
      test('should return false', () => {
        expect(valueDayProgress.isRecruitedAt()).toBeFalsy();
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
      test('should return false', () => {
        expect(valueDayProgress.isRecruitedAt(day1)).toBeFalsy();
      });
    });
    context('when passed day of first appointment', () => {
      test('should return true', () => {
        expect(valueDayProgress.isRecruitedAt(day2)).toBeTruthy();
      });
    });
    context('when passed day between first and second appointments', () => {
      test('should return true', () => {
        expect(valueDayProgress.isRecruitedAt(day3)).toBeTruthy();
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return true', () => {
        expect(valueDayProgress.isRecruitedAt(day4)).toBeTruthy();
      });
    });
    context('when passed day between last appointment and close', () => {
      test('should return true', () => {
        expect(valueDayProgress.isRecruitedAt(day5)).toBeTruthy();
      });
    });
    context('when passed close day', () => {
      test('should return false', () => {
        expect(valueDayProgress.isRecruitedAt(day6)).toBeFalsy();
      });
    });
    context('when passed day between close and second recruit', () => {
      test('should return false', () => {
        expect(valueDayProgress.isRecruitedAt(day7)).toBeFalsy();
      });
    });
    context('when passed second recruit day', () => {
      test('should return true', () => {
        expect(valueDayProgress.isRecruitedAt(day8)).toBeTruthy();
      });
    });
    context('when no props passed', () => {
      test('should return true', () => {
        expect(valueDayProgress.isRecruitedAt()).toBeTruthy();
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
        test('should return false', () => {
          expect(valueDayProgress.isRecruitedAt(day1)).toBeFalsy();
        });
      });
      context('when passed day of first appointment', () => {
        test('should return true', () => {
          expect(valueDayProgress.isRecruitedAt(day2)).toBeTruthy();
        });
      });
      context('when passed day between first and second appointments', () => {
        test('should return true', () => {
          expect(valueDayProgress.isRecruitedAt(day3)).toBeTruthy();
        });
      });
      context('when passed day of appointment after first', () => {
        test('should return true', () => {
          expect(valueDayProgress.isRecruitedAt(day4)).toBeTruthy();
        });
      });
      context('when passed day between last appointment and close', () => {
        test('should return true', () => {
          expect(valueDayProgress.isRecruitedAt(day5)).toBeTruthy();
        });
      });
      context('when passed close day', () => {
        test('should return false', () => {
          expect(valueDayProgress.isRecruitedAt(day6)).toBeFalsy();
        });
      });
      context('when passed day between close and second recruit', () => {
        test('should return false', () => {
          expect(valueDayProgress.isRecruitedAt(day7)).toBeFalsy();
        });
      });
      context('when passed second recruit day', () => {
        test('should return true', () => {
          expect(valueDayProgress.isRecruitedAt(day8)).toBeTruthy();
        });
      });
      context('when passed day after second recruit day', () => {
        test('should return true', () => {
          expect(valueDayProgress.isRecruitedAt(day9)).toBeTruthy();
        });
      });
      context('when passed second close day', () => {
        test('should return false', () => {
          expect(valueDayProgress.isRecruitedAt(day10)).toBeFalsy();
        });
      });
      context('when no props passed', () => {
        test('should return false', () => {
          expect(valueDayProgress.isRecruitedAt()).toBeFalsy();
        });
      });
    }
  );
});
