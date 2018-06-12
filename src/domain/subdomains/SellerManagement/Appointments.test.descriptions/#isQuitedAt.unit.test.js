import { PostId, Day } from '../../../commonTypes';

import { Appointments } from '../Appointments';
import { Appointment } from '../Appointment';

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
PostId.quitPostId = closeValue;

describe('Domain :: entities :: Appointments :: #isQuitedAt', () => {
  let appointments;
  beforeEach(() => {
    appointments = new Appointments();
  });

  context('when appointments have no appointments', () => {
    context('when passed custom day', () => {
      test('should return false', () => {
        expect(appointments.isQuitedAt(day1)).toBeFalsy();
      });
    });

    context('when no props passed', () => {
      test('should return false', () => {
        expect(appointments.isQuitedAt()).toBeFalsy();
      });
    });
  });

  context('when appointments have appointments and not closed', () => {
    beforeEach(() => {
      appointments.setAppointments([
        new Appointment({ postId: value1, day: day2 }),
        new Appointment({ postId: value2, day: day4 }),
      ]);
    });
    context('when passed day before appointments', () => {
      test('should return false', () => {
        expect(appointments.isQuitedAt(day1)).toBeFalsy();
      });
    });
    context('when passed day of first appointment', () => {
      test('should return false', () => {
        expect(appointments.isQuitedAt(day2)).toBeFalsy();
      });
    });
    context('when passed day between first and second appointments', () => {
      test('should return false', () => {
        expect(appointments.isQuitedAt(day3)).toBeFalsy();
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return false', () => {
        expect(appointments.isQuitedAt(day4)).toBeFalsy();
      });
    });
    context('when no props passed', () => {
      test('should return false', () => {
        expect(appointments.isQuitedAt()).toBeFalsy();
      });
    });
  });

  context('when appointments have closed', () => {
    beforeEach(() => {
      appointments.setAppointments([
        new Appointment({ postId: value1, day: day2 }),
        new Appointment({ postId: value2, day: day4 }),
        new Appointment({ postId: closeValue, day: day6 }),
      ]);
    });
    context('when passed day before appointments', () => {
      test('should return false', () => {
        expect(appointments.isQuitedAt(day1)).toBeFalsy();
      });
    });
    context('when passed day of first appointment', () => {
      test('should return false', () => {
        expect(appointments.isQuitedAt(day2)).toBeFalsy();
      });
    });
    context('when passed day between first and second appointments', () => {
      test('should return false', () => {
        expect(appointments.isQuitedAt(day3)).toBeFalsy();
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return false', () => {
        expect(appointments.isQuitedAt(day4)).toBeFalsy();
      });
    });
    context('when passed day between last appointment and close', () => {
      test('should return false', () => {
        expect(appointments.isQuitedAt(day5)).toBeFalsy();
      });
    });
    context('when passed close day', () => {
      test('should return true', () => {
        expect(appointments.isQuitedAt(day6)).toBeTruthy();
      });
    });
    context('when no props passed', () => {
      test('should return true', () => {
        expect(appointments.isQuitedAt()).toBeTruthy();
      });
    });
  });

  context('when appointments have closed and recruited again', () => {
    beforeEach(() => {
      appointments.setAppointments([
        new Appointment({ postId: value1, day: day2 }),
        new Appointment({ postId: value2, day: day4 }),
        new Appointment({ postId: closeValue, day: day6 }),
        new Appointment({ postId: value2, day: day8 }),
      ]);
    });
    context('when passed day before appointments', () => {
      test('should return false', () => {
        expect(appointments.isQuitedAt(day1)).toBeFalsy();
      });
    });
    context('when passed day of first appointment', () => {
      test('should return false', () => {
        expect(appointments.isQuitedAt(day2)).toBeFalsy();
      });
    });
    context('when passed day between first and second appointments', () => {
      test('should return false', () => {
        expect(appointments.isQuitedAt(day3)).toBeFalsy();
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return false', () => {
        expect(appointments.isQuitedAt(day4)).toBeFalsy();
      });
    });
    context('when passed day between last appointment and close', () => {
      test('should return false', () => {
        expect(appointments.isQuitedAt(day5)).toBeFalsy();
      });
    });
    context('when passed close day', () => {
      test('should return true', () => {
        expect(appointments.isQuitedAt(day6)).toBeTruthy();
      });
    });
    context('when passed day between close and second recruit', () => {
      test('should return true', () => {
        expect(appointments.isQuitedAt(day7)).toBeTruthy();
      });
    });
    context('when passed second recruit day', () => {
      test('should return false', () => {
        expect(appointments.isQuitedAt(day8)).toBeFalsy();
      });
    });
    context('when no props passed', () => {
      test('should return false', () => {
        expect(appointments.isQuitedAt()).toBeFalsy();
      });
    });
  });

  context(
    'when appointments have closed, recruited again and close again',
    () => {
      beforeEach(() => {
        appointments.setAppointments([
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
          new Appointment({ postId: closeValue, day: day6 }),
          new Appointment({ postId: value2, day: day8 }),
          new Appointment({ postId: closeValue, day: day10 }),
        ]);
      });
      context('when passed day before appointments', () => {
        test('should return false', () => {
          expect(appointments.isQuitedAt(day1)).toBeFalsy();
        });
      });
      context('when passed day of first appointment', () => {
        test('should return false', () => {
          expect(appointments.isQuitedAt(day2)).toBeFalsy();
        });
      });
      context('when passed day between first and second appointments', () => {
        test('should return false', () => {
          expect(appointments.isQuitedAt(day3)).toBeFalsy();
        });
      });
      context('when passed day of appointment after first', () => {
        test('should return false', () => {
          expect(appointments.isQuitedAt(day4)).toBeFalsy();
        });
      });
      context('when passed day between last appointment and close', () => {
        test('should return false', () => {
          expect(appointments.isQuitedAt(day5)).toBeFalsy();
        });
      });
      context('when passed close day', () => {
        test('should return true', () => {
          expect(appointments.isQuitedAt(day6)).toBeTruthy();
        });
      });
      context('when passed day between close and second recruit', () => {
        test('should return true', () => {
          expect(appointments.isQuitedAt(day7)).toBeTruthy();
        });
      });
      context('when passed second recruit day', () => {
        test('should return false', () => {
          expect(appointments.isQuitedAt(day8)).toBeFalsy();
        });
      });
      context('when passed day after second recruit day', () => {
        test('should return false', () => {
          expect(appointments.isQuitedAt(day9)).toBeFalsy();
        });
      });
      context('when passed second close day', () => {
        test('should return second close day', () => {
          expect(appointments.isQuitedAt(day10)).toBeTruthy();
        });
      });
      context('when no props passed', () => {
        test('should return second close day', () => {
          expect(appointments.isQuitedAt()).toBeTruthy();
        });
      });
    }
  );
});
