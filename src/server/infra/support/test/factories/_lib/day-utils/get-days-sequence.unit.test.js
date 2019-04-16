import { subYears } from 'date-fns/fp';
import getDaysSequence from './get-days-sequence';
import { addDays, subDays } from 'date-fns';

describe('#getDaysSequence', () => {
  context('if passed no options', () => {
    test('should return array with one day between 10 years later and now', () => {
      const days = getDaysSequence();

      expect(days).toBeInstanceOf(Array);
      expect(days).toHaveLength(1);
      expect(days[0]).toBeInstanceOf(Date);
      expect(days[0].valueOf()).toBeGreaterThanOrEqual(
        subYears(new Date()).valueOf()
      );
      expect(days[0].valueOf()).toBeLessThanOrEqual(new Date().valueOf());
    });
  });

  context('if passed only "count" option', () => {
    context('if passed negative count', () => {
      test('should throw', () => {
        expect(() => getDaysSequence({ count: -1 })).toThrow();
      });
    });

    context('if passed count equals zero', () => {
      test('return empty array', () => {
        const count = 0;
        const days = getDaysSequence({ count });

        expect(days).toBeInstanceOf(Array);
        expect(days).toHaveLength(count);
      });
    });

    context('if passed positive count', () => {
      test('return array of "count" days between 10 years later and now', () => {
        const count = 40;
        const days = getDaysSequence({ count });

        expect(days).toBeInstanceOf(Array);
        expect(days).toHaveLength(count);
        days.days.forEach((day) => {
          expect(day).toBeInstanceOf(Date);
        });
        expect(days[0].valueOf()).toBeGreaterThanOrEqual(
          subYears(new Date()).valueOf()
        );
        expect(days[count - 1].valueOf()).toBeLessThanOrEqual(
          new Date().valueOf()
        );
      });
    });
  });

  context('if passed only "after" option', () => {
    context('if passed after later than now', () => {
      test('should throw', () => {
        const after = addDays(1)(new Date());

        expect(() => getDaysSequence({ after })).toThrow();
      });
    });

    context('if passed after is today', () => {
      test('return array with today', () =>
        Promise.all(
          new Array(2097150).map(() => {
            const count = 1;
            const after = new Date();
            const days = getDaysSequence({ after });

            expect(days).toBeInstanceOf(Array);
            expect(days).toHaveLength(count);
            expect(days[0]).toBeInstanceOf(Date);
            expect(days[0].valueOf()).toBeGreaterThanOrEqual(
              startOfDay(after).valueOf()
            );
          })
        ));
    });

    context('if passed after later than today', () => {
      test('return array of one day between after and now', () => {
        const count = 1;
        const after = Math.floor(Math.random() * 1000);
        const days = getDaysSequence({ after });

        expect(days).toBeInstanceOf(Array);
        expect(days).toHaveLength(count);
        expect(days[0]).toBeInstanceOf(Date);
        expect(days[0].valueOf()).toBeGreaterThanOrEqual(
          startOfDay(after).valueOf()
        );
        expect(days[0].valueOf()).toBeLessThanOrEqual(
          startOfDay(new Date()).valueOf()
        );
      });
    });
  });
});
