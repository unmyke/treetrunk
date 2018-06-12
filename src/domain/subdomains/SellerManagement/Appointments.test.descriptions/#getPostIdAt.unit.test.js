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

describe('Domain :: entities :: Appointments :: #getPostIdAt', () => {
  let appointments;
  beforeEach(() => {
    appointments = new Appointments();
  });

  context('when appointments have no appointments', () => {
    context('when passed custom day', () => {
      test('should return undefined', () => {
        expect(appointments.getPostIdAt(day1)).toBeUndefined();
      });
    });

    context('when no props passed', () => {
      test('should return undefined', () => {
        expect(appointments.getPostIdAt()).toBeUndefined();
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
      test('should return undefined', () => {
        expect(appointments.getPostIdAt(day1)).toBeUndefined();
      });
    });
    context('when passed day of first appointment', () => {
      test('should return value of first appointment', () => {
        expect(appointments.getPostIdAt(day2)).toBe(value1);
      });
    });
    context('when passed day between first and second appointments', () => {
      test('should return value of first appointment', () => {
        expect(appointments.getPostIdAt(day3)).toBe(value1);
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return value of appointment', () => {
        expect(appointments.getPostIdAt(day4)).toBe(value2);
      });
    });
    context('when no props passed', () => {
      test('should return undefined', () => {
        expect(appointments.getPostIdAt()).toBe(value2);
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
      test('should return undefined', () => {
        expect(appointments.getPostIdAt(day1)).toBeUndefined();
      });
    });
    context('when passed day of first appointment', () => {
      test('should return value of first appointment', () => {
        expect(appointments.getPostIdAt(day2)).toBe(value1);
      });
    });
    context('when passed day between first and second appointments', () => {
      test('should return value of first appointment', () => {
        expect(appointments.getPostIdAt(day3)).toBe(value1);
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return value of appointment', () => {
        expect(appointments.getPostIdAt(day4)).toBe(value2);
      });
    });
    context('when passed day between last appointment and close', () => {
      test('should return value of appointment', () => {
        expect(appointments.getPostIdAt(day5)).toBe(value2);
      });
    });
    context('when passed close day', () => {
      test('should return undefined', () => {
        expect(appointments.getPostIdAt(day6)).toBeUndefined();
      });
    });
    context('when no props passed', () => {
      test('should return undefined', () => {
        expect(appointments.getPostIdAt()).toBeUndefined();
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
      test('should return undefined', () => {
        expect(appointments.getPostIdAt(day1)).toBeUndefined();
      });
    });
    context('when passed day of first appointment', () => {
      test('should return value of first appointment', () => {
        expect(appointments.getPostIdAt(day2)).toBe(value1);
      });
    });
    context('when passed day between first and second appointments', () => {
      test('should return value of first appointment', () => {
        expect(appointments.getPostIdAt(day3)).toBe(value1);
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return value of appointment', () => {
        expect(appointments.getPostIdAt(day4)).toBe(value2);
      });
    });
    context('when passed day between last appointment and close', () => {
      test('should return value of appointment', () => {
        expect(appointments.getPostIdAt(day5)).toBe(value2);
      });
    });
    context('when passed close day', () => {
      test('should return undefined', () => {
        expect(appointments.getPostIdAt(day6)).toBeUndefined();
      });
    });
    context('when passed day between close and second recruit', () => {
      test('should return undefined', () => {
        expect(appointments.getPostIdAt(day7)).toBeUndefined();
      });
    });
    context('when passed second recruit day', () => {
      test('should return value of second recruit', () => {
        expect(appointments.getPostIdAt(day8)).toBe(value2);
      });
    });
    context('when no props passed', () => {
      test('should return value of second recruit', () => {
        expect(appointments.getPostIdAt()).toBe(value2);
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
        test('should return undefined', () => {
          expect(appointments.getPostIdAt(day1)).toBeUndefined();
        });
      });
      context('when passed day of first appointment', () => {
        test('should return value of first appointment', () => {
          expect(appointments.getPostIdAt(day2)).toBe(value1);
        });
      });
      context('when passed day between first and second appointments', () => {
        test('should return value of first appointment', () => {
          expect(appointments.getPostIdAt(day3)).toBe(value1);
        });
      });
      context('when passed day of appointment after first', () => {
        test('should return value of appointment', () => {
          expect(appointments.getPostIdAt(day4)).toBe(value2);
        });
      });
      context('when passed day between last appointment and close', () => {
        test('should return value of appointment', () => {
          expect(appointments.getPostIdAt(day5)).toBe(value2);
        });
      });
      context('when passed close day', () => {
        test('should return undefined', () => {
          expect(appointments.getPostIdAt(day6)).toBeUndefined();
        });
      });
      context('when passed day between close and second recruit', () => {
        test('should return undefined', () => {
          expect(appointments.getPostIdAt(day7)).toBeUndefined();
        });
      });
      context('when passed second recruit day', () => {
        test('should return value of second recruit', () => {
          expect(appointments.getPostIdAt(day8)).toBe(value2);
        });
      });
      context('when passed day after second recruit day', () => {
        test('should return value of second recruit', () => {
          expect(appointments.getPostIdAt(day9)).toBe(value2);
        });
      });
      context('when passed second close day', () => {
        test('should return undefined', () => {
          expect(appointments.getPostIdAt(day10)).toBeUndefined();
        });
      });
      context('when no props passed', () => {
        test('should return undefined', () => {
          expect(appointments.getPostIdAt()).toBeUndefined();
        });
      });
    }
  );
});
