import { startOfDay, subYears } from 'date-fns/fp';
import getRandomDay from './get-random-day';

describe('infra :: support :: factories :: lib :: #getRandomDay', () => {
  context('if passed no options', () => {
    test('should return day before now', () => {
      const randomDate = getRandomDay();

      expect(randomDate).toBeInstanceOf(Date);
      expect(randomDate.getHours()).toBe(0);
      expect(randomDate.getMinutes()).toBe(0);
      expect(randomDate.getSeconds()).toBe(0);
      expect(randomDate.getMilliseconds()).toBe(0);
      expect(randomDate.valueOf()).toBeLessThanOrEqual(Date.now().valueOf());
    });
  });

  context('if passed "after" option', () => {
    test('should return day after passed and before today', () => {
      const after = new Date('2010-01-07 11:01:12.001+08:00');
      const randomDate = getRandomDay({ after });

      expect(randomDate).toBeInstanceOf(Date);
      expect(randomDate.getHours()).toBe(0);
      expect(randomDate.getMinutes()).toBe(0);
      expect(randomDate.getSeconds()).toBe(0);
      expect(randomDate.getMilliseconds()).toBe(0);
      expect(randomDate.valueOf()).toBeLessThanOrEqual(Date.now());
      expect(randomDate.valueOf()).toBeGreaterThanOrEqual(
        startOfDay(after).valueOf()
      );
    });
  });

  context('if passed "before" option', () => {
    test('should return day between before passed day and after 10 years later', () => {
      const before = new Date('2010-01-07 11:01:12.001+08:00');
      const sub10Years = subYears(10);
      const randomDate = getRandomDay({ before });

      expect(randomDate).toBeInstanceOf(Date);
      expect(randomDate.getHours()).toBe(0);
      expect(randomDate.getMinutes()).toBe(0);
      expect(randomDate.getSeconds()).toBe(0);
      expect(randomDate.getMilliseconds()).toBe(0);
      expect(randomDate.valueOf()).toBeLessThanOrEqual(
        startOfDay(before).valueOf()
      );
      expect(randomDate.valueOf()).toBeGreaterThanOrEqual(
        startOfDay(sub10Years(before)).valueOf()
      );
    });
  });

  context('if passed "after" and "before" option', () => {
    context('if passed "after" later than "before"', () => {
      test('should throw error', () => {
        const after = new Date('2010-01-08 11:01:12.001+08:00');
        const before = new Date('2010-01-07 11:01:12.001+08:00');

        expect(() => getRandomDay({ after, before })).toThrow();
      });
    });

    context('if passed "after" equals "before"', () => {
      test('should return same day', () => {
        const after = new Date('2010-01-08 00:00:00.000+08:00');
        const before = new Date('2010-01-08 23:59:59.999+08:00');
        const randomDate = getRandomDay({ after, before });

        expect(randomDate).toBeInstanceOf(Date);
        expect(randomDate.getHours()).toBe(0);
        expect(randomDate.getMinutes()).toBe(0);
        expect(randomDate.getSeconds()).toBe(0);
        expect(randomDate.getMilliseconds()).toBe(0);
        expect(randomDate.valueOf()).toBe(startOfDay(after).valueOf());
        expect(randomDate.valueOf()).toBe(startOfDay(before).valueOf());
      });
    });

    context('if passed "after" earlier than "before"', () => {
      test('should return same day', () => {
        const after = new Date('2010-01-08 00:00:00.000+08:00');
        const before = new Date('2017-01-08 23:59:59.999+08:00');
        const randomDate = getRandomDay({ after, before });

        expect(randomDate).toBeInstanceOf(Date);
        expect(randomDate.getHours()).toBe(0);
        expect(randomDate.getMinutes()).toBe(0);
        expect(randomDate.getSeconds()).toBe(0);
        expect(randomDate.getMilliseconds()).toBe(0);
        expect(randomDate.valueOf()).toBeGreaterThanOrEqual(
          startOfDay(after).valueOf()
        );
        expect(randomDate.valueOf()).toBeLessThanOrEqual(
          startOfDay(before).valueOf()
        );
      });
    });
  });
});
