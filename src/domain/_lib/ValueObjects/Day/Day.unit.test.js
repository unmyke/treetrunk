import { Day } from '.';

// const { errorNotADate, errorNotADay, errorNotANumber } = Day;

const getMonday = (date) =>
  new Date(date.valueOf() - ((date.getDay() + 6) % 7) * (24 * 60 * 60 * 1000));
const getSunday = (date) =>
  new Date(date.valueOf() + ((7 - date.getDay()) % 7) * (24 * 60 * 60 * 1000));

describe('Domain :: lib :: valueObjects :: Day', () => {
  describe('Day#createStartOfWeek', () => {
    context('when pass correct date', () => {
      test("return new inctance of Day, that represence  day's start of week", () => {
        const date = new Date('2018.04.12 12:45');
        const monday = getMonday(date);
        const expectedDay = new Day({ value: monday });

        const day = Day.createStartOfWeek(date);

        expect(day).toEqual(expectedDay);
      });
    });

    context('when pass undefined', () => {
      test("return new inctance of Day, that represence  today's start of week", () => {
        const monday = getMonday(new Date());
        const expectedDay = new Day({ value: monday });

        expect(Day.createStartOfWeek()).toEqual(expectedDay);
      });
    });

    // context('when pass incorrect date', () => {
    //   test('throw exeption', () => {
    //     expect(() => Day.createStartOfWeek(new Date('Incorrect Date'))).toThrow(
    //       errorNotADate
    //     );
    //   });
    // });

    // context('when pass not a date', () => {
    //   test('throw exeption', () => {
    //     expect(() => Day.createStartOfWeek('Incorrect input')).toThrow(
    //       errorNotADate
    //     );
    //   });
    // });
  });

  describe('Day#createEndOfWeek', () => {
    context('when pass correct date', () => {
      test("return new inctance of Day, that represence  day's end of week", () => {
        const date = new Date('2018.04.12 12:45');
        const sunday = getSunday(date);
        const expectedDay = new Day({ value: sunday });

        const day = Day.createEndOfWeek(date);

        expect(day).toEqual(expectedDay);
      });
    });

    context('when pass undefined', () => {
      test("return new inctance of Day, that represence  today's end of week", () => {
        const date = new Date();
        const curDayOfWeek = date.getDay();

        const expectedDay = new Day({ value: getSunday(date) });

        expect(Day.createEndOfWeek()).toEqual(expectedDay);
      });
    });

    // context('when pass incorrect date', () => {
    //   test('throw exeption', () => {
    //     expect(() => Day.createEndOfWeek(new Date('Incorrect Date'))).toThrow(
    //       errorNotADate
    //     );
    //   });
    // });

    // context('when pass not a date', () => {
    //   test('throw exeption', () => {
    //     expect(() => Day.createEndOfWeek('Incorrect input')).toThrow(
    //       errorNotADate
    //     );
    //   });
    // });
  });

  describe('#isValid', () => {
    const correctDateParam = { value: new Date() };
    const incorrectDateParam = { value: new Date('Incorrect Date') };
    const incorrectParam = { value: 'string' };
    const emptyParam = {};
    const undefinedDateParam = { value: undefined };

    context('when construct with no param', () => {
      test('should be true', () => {
        const day = new Day();

        expect(day.isValid()).toBeTruthy();
      });
    });

    context('when construct with date', () => {
      test('should be true', () => {
        const day = new Day(correctDateParam);

        expect(day.isValid()).toBeTruthy();
      });
    });

    context('when construct with empty param', () => {
      test('should be false', () => {
        const day = new Day(emptyParam);

        expect(day.isValid()).toBeFalsy();
      });
    });

    context('when construct with inccorect param', () => {
      test('should be false', () => {
        const day = new Day(incorrectParam);

        expect(day.isValid()).toBeFalsy();
      });
    });

    context('when construct with undefined date param', () => {
      test('should be false', () => {
        const day = new Day(undefinedDateParam);

        expect(day.isValid()).toBeFalsy();
      });
    });

    context('when construct with incorrect date param', () => {
      test('should be false', () => {
        const day = new Day(incorrectDateParam);

        expect(day.isValid()).toBeFalsy();
      });
    });
  });

  describe('#equals', () => {
    const value = new Date(2017, 2, 10, 14, 2, 4, 0);
    const day = new Day({ value });

    context('when two days is the same day', () => {
      test('return true', () => {
        expect(day.equals(day)).toBeTruthy();
      });
    });

    context('when two days constructed same date', () => {
      test('return true', () => {
        const equalDay = new Day({ value });

        expect(day.equals(equalDay)).toBeTruthy();
      });
    });

    context('when two days constructed same day, but diiferent time', () => {
      test('return true', () => {
        const anotherValue = new Date(2017, 2, 10, 23, 59, 59, 999);
        const equalDay = new Day({ value: anotherValue });

        expect(day.equals(equalDay)).toBeTruthy();
      });
    });

    context('when two days constructed different dates', () => {
      test('return false', () => {
        const anotherValue = new Date(2017, 2, 9, 23, 59, 59, 999);
        const notEqualDay = new Day({ value: anotherValue });

        expect(day.equals(notEqualDay)).toBeFalsy();
      });
    });

    context('when second day is not valid day', () => {
      test('return false', () => {
        const anotherValue = new Date('Invalid Date');
        const notEqualDay = new Day({ value: anotherValue });

        expect(day.equals(notEqualDay)).toBeFalsy();
      });
    });

    context('when second day is not Day instance', () => {
      test('return false', () => {
        const anotherValue = new Date('Invalid Date');

        expect(day.equals(anotherValue)).toBeFalsy();
      });
    });
  });

  describe('#contains', () => {
    const value = new Date(2017, 2, 10, 14, 2, 4, 0);
    const day = new Day({ value });

    context('when pass same date', () => {
      test('return true', () => {
        expect(day.contains(value)).toBeTruthy();
      });
    });

    context('when pass start Of date', () => {
      test('return true', () => {
        expect(day.contains(new Date(2017, 2, 10, 0, 0, 0, 0))).toBeTruthy();
      });
    });

    context('when pass end Of date', () => {
      test('return true', () => {
        expect(
          day.contains(new Date(2017, 2, 10, 23, 59, 59, 999))
        ).toBeTruthy();
      });
    });

    context('when pass next date', () => {
      test('return false', () => {
        expect(day.contains(new Date(2017, 2, 11, 0, 0, 0, 0))).toBeFalsy();
      });
    });

    context('when pass previous date', () => {
      test('return false', () => {
        expect(day.contains(new Date(2017, 2, 9, 23, 59, 59, 999))).toBeFalsy();
      });
    });

    // context('when pass not date', () => {
    //   test('throw error', () => {
    //     expect(() => day.contains('')).toThrow();
    //   });
    // });

    // context('when pass undefined', () => {
    //   test('throw error', () => {
    //     expect(() => day.contains('')).toThrow();
    //   });
    // });

    // context('when pass incorect date', () => {
    //   test('throw error', () => {
    //     expect(() => day.contains(new Date('Invalid Date'))).toThrow();
    //   });
    // });
  });

  describe('#addDays', () => {
    const value = new Date(2017, 0, 1, 14, 2, 4, 4);
    const day = new Day({ value });

    context('when add undefined', () => {
      test('return new Day instance of same day', () => {
        const addedValue = new Date(2017, 0, 1, 0, 0, 0, 4);
        const expectedDay = new Day({ value: addedValue });

        expect(day.addDays()).toEqual(expectedDay);
      });
    });

    // context('when add not a day', () => {
    //   test('throw error', () => {
    //     expect(() => day.addDays('incorrect input')).toThrow(errorNotANumber);
    //   });
    // });

    context('when add 0', () => {
      test('return new Day instance of same day', () => {
        const addedValue = new Date(2017, 0, 1, 0, 0, 0, 4);
        const expectedDay = new Day({ value: addedValue });

        expect(day.addDays(0)).toEqual(expectedDay);
      });
    });

    context('when add 1', () => {
      test('return new Day instance of next day', () => {
        const addedValue = new Date(2017, 0, 2, 0, 0, 0, 4);
        const expectedDay = new Day({ value: addedValue });

        expect(day.addDays(1)).toEqual(expectedDay);
      });
    });

    context('when add -1', () => {
      test('return new Day instance of previous day', () => {
        const addedValue = new Date(2017, 0, 0, 0, 0, 0, 4);
        const expectedDay = new Day({ value: addedValue });

        expect(day.addDays(-1)).toEqual(expectedDay);
      });
    });

    context('when add 15', () => {
      test('return new Day instance of 15 days later day', () => {
        const addedValue = new Date(2017, 0, 16, 0, 0, 0, 4);
        const expectedDay = new Day({ value: addedValue });

        expect(day.addDays(15)).toEqual(expectedDay);
      });
    });
  });

  describe('#subDays', () => {
    const value = new Date(2017, 0, 16, 14, 2, 4, 4);
    const day = new Day({ value });

    context('when sub undefined', () => {
      test('return new Day instance of same day', () => {
        const addedValue = new Date(2017, 0, 16, 0, 0, 0, 4);
        const expectedDay = new Day({ value: addedValue });

        expect(day.subDays()).toEqual(expectedDay);
      });
    });

    // context('when sub not a day', () => {
    //   test('throw error', () => {
    //     expect(() => day.subDays('incorrect input')).toThrow(errorNotANumber);
    //   });
    // });

    context('when sub 0', () => {
      test('return new Day instance of same day', () => {
        const addedValue = new Date(2017, 0, 16, 0, 0, 0, 4);
        const expectedDay = new Day({ value: addedValue });

        expect(day.subDays(0)).toEqual(expectedDay);
      });
    });

    context('when sub 1', () => {
      test('return new Day instance of next day', () => {
        const addedValue = new Date(2017, 0, 15, 0, 0, 0, 4);
        const expectedDay = new Day({ value: addedValue });

        expect(day.subDays(1)).toEqual(expectedDay);
      });
    });

    context('when sub -1', () => {
      test('return new Day instance of previous day', () => {
        const addedValue = new Date(2017, 0, 17, 0, 0, 0, 4);
        const expectedDay = new Day({ value: addedValue });

        expect(day.subDays(-1)).toEqual(expectedDay);
      });
    });

    context('when sub 15', () => {
      test('return new Day instance of 15 days later day', () => {
        const addedValue = new Date(2017, 0, 1, 0, 0, 0, 4);
        const expectedDay = new Day({ value: addedValue });

        expect(day.subDays(15)).toEqual(expectedDay);
      });
    });
  });

  describe('#difference', () => {
    const value = new Date();
    const today = new Day({ value });

    // context('when passed right day is not a day', () => {
    //   test('throw error', () => {
    //     expect(() => today.difference('incorrect input')).toThrow(errorNotADay);
    //   });
    // });

    context('when passed days are the same day', () => {
      test('return 0', () => {
        expect(today.difference(today)).toBe(0);
      });
    });

    context('when pass another instance of same day', () => {
      test('return 0', () => {
        const addedValue = new Date();
        const sameDay = new Day({ value: addedValue });

        expect(today.difference(sameDay)).toBe(0);
      });
    });

    context('when pass left day is next day of right date', () => {
      test('return 1', () => {
        const yesterdayDay = today.subDays(1);

        expect(today.difference(yesterdayDay)).toBe(1);
      });
    });

    context('when pass right day is next day of left date', () => {
      test('return -1', () => {
        const yesterdayDay = today.subDays(1);

        expect(yesterdayDay.difference(today)).toBe(-1);
      });
    });

    context('when pass right day is 15 days after left date', () => {
      test('return 15', () => {
        const earlyDay = today.subDays(15);

        expect(today.difference(earlyDay)).toBe(15);
      });
    });
  });

  describe('#differenceInMonths', () => {
    const value = new Date('2018-03-01 07:16:59 GMT+0800 (+08)');
    const day = new Day({ value });

    // context('when passed day is not a day', () => {
    //   test('throw error', () => {
    //     expect(() => day.differenceInMonths('incorrect input')).toThrow(
    //       errorNotADay
    //     );
    //   });
    // });

    // context('when passed day is incorrect day', () => {
    //   test('throw error', () => {
    //     expect(() =>
    //       day.differenceInMonths(new Day({ value: new Date('Incorrect date') }))
    //     ).toThrow(errorNotADay);
    //   });
    // });

    context('when passed days are the same day', () => {
      test('return 0', () => {
        expect(day.differenceInMonths(day)).toBe(0);
      });
    });

    context('when pass another instance of same day', () => {
      test('return 0', () => {
        const sameValue = new Date('2018-03-01 07:16:59 GMT+0800 (+08)');
        const sameDay = new Day({ value: sameValue });

        expect(sameDay.differenceInMonths(day)).toBe(0);
      });
    });

    context('when pass next month date', () => {
      test('return -1', () => {
        const nextMonthDayValue = new Date(
          '2018-04-01 07:16:59 GMT+0800 (+08)'
        );
        const nextMonthDay = new Day({ value: nextMonthDayValue });

        expect(day.differenceInMonths(nextMonthDay)).toBe(-1);
      });
    });

    context('when pass month of left date', () => {
      test('return 1', () => {
        const prevMonthDayValue = new Date(
          '2018-02-01 07:16:59 GMT+0800 (+08)'
        );
        const prevMonthDay = new Day({ value: prevMonthDayValue });

        expect(day.differenceInMonths(prevMonthDay)).toBe(1);
      });
    });

    context('when pass end of current month', () => {
      test('return 0', () => {
        const nextMonthDayValue = new Date(
          '2018-03-30 23:59:59 GMT+0800 (+08)'
        );
        const nextMonthDay = new Day({ value: nextMonthDayValue });

        expect(day.differenceInMonths(nextMonthDay)).toBe(0);
      });
    });

    context(
      'when pass previous month day, but difference less one month',
      () => {
        test('return 0', () => {
          const prevMonthDayValue = new Date(
            '2018-02-02 00:00:00 GMT+0800 (+08)'
          );
          const prevMonthDay = new Day({ value: prevMonthDayValue });

          expect(day.differenceInMonths(prevMonthDay)).toBe(0);
        });
      }
    );

    context('when pass day 7 months before', () => {
      test('return 7', () => {
        const beforeMonthsDayValue = new Date(
          '2017-08-01 07:16:59 GMT+0800 (+08)'
        );
        const beforeMonthsDay = new Day({ value: beforeMonthsDayValue });

        expect(day.differenceInMonths(beforeMonthsDay)).toBe(7);
      });
    });
  });

  describe('#isValidDay', () => {
    context('when pass correct day', () => {
      test('return true', () => {
        const day = new Day({ value: new Date() });

        expect(day.isValid()).toBeTruthy();
      });
    });

    context('when pass incorrect day', () => {
      context('when pass day with incorrect value', () => {
        test('return false', () => {
          const day = new Day({ value: '' });

          expect(day.isValid()).toBeFalsy();
        });
      });

      context('when pass day with incorrect date', () => {
        test('return false', () => {
          const day = new Day({ value: new Date('') });

          expect(day.isValid()).toBeFalsy();
        });
      });
    });
  });

  describe('#format', () => {
    context('when pass correct day without format', () => {
      test('return default date format', () => {
        const value = new Date('2018-03-08 23:59:59 GMT+0800');
        const day = new Day({ value });

        expect(day.format()).toBe('08.03.2018');
      });
    });

    context('when pass correct day with format', () => {
      test('return formated date', () => {
        const value = new Date('2015-12-21 00:00:00 GMT+0800');
        const formatString = 'DD MMMM YYYY';
        const day = new Day({ value });

        expect(day.format(formatString)).toBe('21 декабря 2015');
      });
    });

    context('when pass incorrect day', () => {
      context('when pass day with incorrect value', () => {
        test('return NaD error name', () => {
          const day = new Day({ value: '' });

          expect(day.format()).toBe(errorNotADay.details[0]);
        });
      });

      context('when pass day with incorrect date', () => {
        test('return NaD error name', () => {
          const day = new Day({ value: new Date('') });

          expect(day.format()).toBe(errorNotADay.details[0]);
        });
      });
    });
  });
});
