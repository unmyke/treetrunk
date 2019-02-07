import Diary from './diary';
import Day from '../day';
import { errors } from '../../errors';

const states = {
  NEW: 'new',
  STARTED: 'started',
  CLOSED: 'closed',
};

const day1 = new Day({ value: new Date('2017.01.01 00:00:00.000+08:00') });
const day2 = new Day({ value: new Date('2017.02.01 00:00:00.000+08:00') });
const day3 = new Day({ value: new Date('2017.03.01 00:00:00.000+08:00') });
const day4 = new Day({ value: new Date('2017.04.01 00:00:00.000+08:00') });
const day5 = new Day({ value: new Date('2017.05.01 00:00:00.000+08:00') });
const day6 = new Day({ value: new Date('2017.06.01 00:00:00.000+08:00') });

const value1 = 'value1';
const value2 = 'value2';
const value3 = 'value3';
const value4 = 'value4';
const closeValue = 'closeValue';

let diary;
let diaryInstanceAt;
let records;

describe('Domain :: commonTypes :: Diary :: #static', () => {
  afterEach(() => {
    diary = undefined;
  });

  describe('#restore', () => {
    describe('positive', () => {
      context('#1', () => {
        test('should return new diary', () => {
          diary = Diary.restore([], closeValue);

          expect(diary.state).toBe(states.NEW);
          expect(diary.records).toHaveLength(0);
          expect(diary.recordValue).toBeUndefined();
          expect(diary.closeDay).toBeUndefined();
        });
      });

      context('#2', () => {
        beforeEach(() => {
          records = [{ value: value1, day: day1 }];
        });

        test('should return started diary', () => {
          diary = Diary.restore(records, closeValue);

          expect(diary.state).toBe(states.STARTED);
          expect(diary.records).toEqual([{ value: value1, day: day1 }]);
          expect(diary.recordValue).toEqual(value1);
          expect(diary.closeDay).toBeUndefined();
        });
      });

      context('#3', () => {
        beforeEach(() => {
          records = [
            { value: value1, day: day1 },
            { value: closeValue, day: day2 },
          ];
        });

        test('should return closed diary', () => {
          diary = Diary.restore(records, closeValue);

          expect(diary.state).toBe(states.CLOSED);
          expect(diary.records).toHaveLength(0);
          expect(diary.recordValue).toBeUndefined();
          expect(diary.closeDay).toEqual(day2);
        });
      });

      context('#4', () => {
        beforeEach(() => {
          records = [
            { value: value1, day: day1 },
            { value: value2, day: day2 },
            { value: closeValue, day: day3 },
          ];
        });

        test('should return closed diary', () => {
          diary = Diary.restore(records, closeValue);

          expect(diary.state).toBe(states.CLOSED);
          expect(diary.records).toHaveLength(0);
          expect(diary.recordValue).toBeUndefined();
          expect(diary.closeDay).toEqual(day3);
        });
      });

      context('#5', () => {
        beforeEach(() => {
          records = [
            { value: value1, day: day1 },
            { value: value2, day: day3 },
            { value: closeValue, day: day2 },
          ];
        });

        test('should return started diary', () => {
          diary = Diary.restore(records, closeValue);

          expect(diary.state).toBe(states.STARTED);
          expect(diary.records).toEqual([{ value: value2, day: day3 }]);
          expect(diary.recordValue).toEqual(value2);
          expect(diary.closeDay).toBeUndefined();
        });
      });

      context('#6', () => {
        beforeEach(() => {
          records = [
            { value: value1, day: day1 },
            { value: value2, day: day3 },
            { value: value3, day: day4 },
            { value: closeValue, day: day2 },
          ];
        });

        test('should return started diary', () => {
          diary = Diary.restore(records, closeValue);

          expect(diary.state).toBe(states.STARTED);
          expect(diary.records).toEqual([
            { value: value2, day: day3 },
            { value: value3, day: day4 },
          ]);
          expect(diary.recordValue).toEqual(value3);
          expect(diary.closeDay).toBeUndefined();
        });
      });

      context('#7', () => {
        beforeEach(() => {
          records = [
            { value: value1, day: day1 },
            { value: value2, day: day3 },
            { value: value3, day: day4 },
            { value: closeValue, day: day2 },
            { value: closeValue, day: day5 },
          ];
        });

        test('should return started diary', () => {
          diary = Diary.restore(records, closeValue);

          expect(diary.state).toBe(states.CLOSED);
          expect(diary.records).toHaveLength(0);
          expect(diary.recordValue).toBeUndefined();
          expect(diary.closeDay).toEqual(day5);
        });
      });

      context('#8', () => {
        beforeEach(() => {
          records = [
            { value: value1, day: day1 },
            { value: value2, day: day3 },
            { value: value3, day: day5 },
            { value: closeValue, day: day2 },
            { value: closeValue, day: day4 },
          ];
        });

        test('should return started diary', () => {
          diary = Diary.restore(records, closeValue);

          expect(diary.state).toBe(states.STARTED);
          expect(diary.records).toEqual([{ value: value3, day: day5 }]);
          expect(diary.recordValue).toEqual(value3);
          expect(diary.closeDay).toBeUndefined();
        });
      });
    });

    describe('negative', () => {
      context('#1', () => {
        beforeEach(() => {
          records = [, { value: closeValue, day: day1 }];
        });

        test('should throw exeption', () => {
          expect(() => {
            diary = Diary.restore(records, closeValue);
          }).toThrowError(errors.inconsistentState());
        });
      });

      context('#2', () => {
        beforeEach(() => {
          records = [
            { value: value1, day: day2 },
            { value: value2, day: day3 },
            { value: closeValue, day: day1 },
          ];
        });

        test('should throw exeption', () => {
          expect(() => {
            diary = Diary.restore(records, closeValue);
          }).toThrowError(errors.inconsistentState());
        });
      });

      context('#3', () => {
        beforeEach(() => {
          records = [
            { value: value1, day: day1 },
            { value: closeValue, day: day2 },
            { value: closeValue, day: day3 },
          ];
        });

        test('should throw exeption', () => {
          expect(() => {
            diary = Diary.restore(records, closeValue);
          }).toThrowError(errors.inconsistentState());
        });
      });
      context('#4', () => {
        beforeEach(() => {
          records = [
            { value: value1, day: day1 },
            { value: value2, day: day4 },
            { value: closeValue, day: day2 },
            { value: closeValue, day: day3 },
          ];
        });

        test('should throw exeption', () => {
          expect(() => {
            diary = Diary.restore(records, closeValue);
          }).toThrowError(errors.inconsistentState());
        });
      });

      context('#5', () => {
        beforeEach(() => {
          records = [
            { value: value1, day: day1 },
            { value: value2, day: day3 },
            { value: value2, day: day4 },
            { value: closeValue, day: day2 },
          ];
        });

        test('should throw exeption', () => {
          expect(() => {
            diary = Diary.restore(records, closeValue);
          }).toThrowError(errors.inconsistentState());
        });
      });

      context('#6', () => {
        beforeEach(() => {
          records = [
            { value: value1, day: day1 },
            { value: value2, day: day3 },
            { value: value2, day: day4 },
            { value: closeValue, day: day2 },
            { value: closeValue, day: day5 },
          ];
        });

        test('should throw exeption', () => {
          expect(() => {
            diary = Diary.restore(records, closeValue);
          }).toThrowError(errors.inconsistentState());
        });
      });

      context('#7', () => {
        beforeEach(() => {
          records = [
            { value: value1, day: day1 },
            { value: value2, day: day2 },
            { value: closeValue, day: day2 },
          ];
        });

        test('should throw exeption', () => {
          expect(() => {
            diary = Diary.restore(records, closeValue);
          }).toThrowError(errors.inconsistentState());
        });
      });

      context('#8', () => {
        beforeEach(() => {
          records = [
            { value: value1, day: day1 },
            { value: value2, day: day1 },
            { value: closeValue, day: day2 },
          ];
        });

        test('should throw exeption', () => {
          expect(() => {
            diary = Diary.restore(records, closeValue);
          }).toThrowError(errors.inconsistentState());
        });
      });
    });
  });

  describe('#instanceAt', () => {
    beforeEach(() => {
      diary = Diary.restore(
        [
          { value: value1, day: day1 },
          { value: value2, day: day3 },
          { value: value3, day: day4 },
          { value: value4, day: day6 },
          { value: closeValue, day: day2 },
          { value: closeValue, day: day5 },
        ],
        closeValue
      );
    });

    afterEach(() => {
      diaryInstanceAt = undefined;
    });

    test('#1', () => {
      diaryInstanceAt = Diary.instanceAt(diary, day1.prev());

      expect(diaryInstanceAt.state).toBe(states.NEW);
      expect(diaryInstanceAt.records).toHaveLength(0);
      expect(diaryInstanceAt.recordValue).toBeUndefined();
      expect(diaryInstanceAt.closeDay).toBeUndefined();
    });

    test('#2', () => {
      diaryInstanceAt = Diary.instanceAt(diary, day1);

      expect(diaryInstanceAt.state).toBe(states.STARTED);
      expect(diaryInstanceAt.records).toEqual([{ value: value1, day: day1 }]);
      expect(diaryInstanceAt.recordValue).toEqual(value1);
      expect(diaryInstanceAt.closeDay).toBeUndefined();
    });

    test('#3', () => {
      diaryInstanceAt = Diary.instanceAt(diary, day2.prev());

      expect(diaryInstanceAt.state).toBe(states.STARTED);
      expect(diaryInstanceAt.records).toEqual([{ value: value1, day: day1 }]);
      expect(diaryInstanceAt.recordValue).toEqual(value1);
      expect(diaryInstanceAt.closeDay).toBeUndefined();
    });

    test('#4', () => {
      diaryInstanceAt = Diary.instanceAt(diary, day2);

      expect(diaryInstanceAt.state).toBe(states.CLOSED);
      expect(diaryInstanceAt.records).toHaveLength(0);
      expect(diaryInstanceAt.recordValue).toBeUndefined();
      expect(diaryInstanceAt.closeDay).toEqual(day2);
    });

    test('#4', () => {
      diaryInstanceAt = Diary.instanceAt(diary, day3.prev());

      expect(diaryInstanceAt.state).toBe(states.CLOSED);
      expect(diaryInstanceAt.records).toHaveLength(0);
      expect(diaryInstanceAt.recordValue).toBeUndefined();
      expect(diaryInstanceAt.closeDay).toEqual(day2);
    });

    test('#5', () => {
      diaryInstanceAt = Diary.instanceAt(diary, day3);

      expect(diaryInstanceAt.state).toBe(states.STARTED);
      expect(diaryInstanceAt.records).toEqual([{ value: value2, day: day3 }]);
      expect(diaryInstanceAt.recordValue).toEqual(value2);
      expect(diaryInstanceAt.closeDay).toBeUndefined();
    });

    test('#6', () => {
      diaryInstanceAt = Diary.instanceAt(diary, day4.prev());

      expect(diaryInstanceAt.state).toBe(states.STARTED);
      expect(diaryInstanceAt.records).toEqual([{ value: value2, day: day3 }]);
      expect(diaryInstanceAt.recordValue).toEqual(value2);
      expect(diaryInstanceAt.closeDay).toBeUndefined();
    });

    test('#7', () => {
      diaryInstanceAt = Diary.instanceAt(diary, day4);

      expect(diaryInstanceAt.state).toBe(states.STARTED);
      expect(diaryInstanceAt.records).toEqual([
        { value: value2, day: day3 },
        { value: value3, day: day4 },
      ]);
      expect(diaryInstanceAt.recordValue).toEqual(value3);
      expect(diaryInstanceAt.closeDay).toBeUndefined();
    });

    test('#7', () => {
      diaryInstanceAt = Diary.instanceAt(diary, day5.prev());

      expect(diaryInstanceAt.state).toBe(states.STARTED);
      expect(diaryInstanceAt.records).toEqual([
        { value: value2, day: day3 },
        { value: value3, day: day4 },
      ]);
      expect(diaryInstanceAt.recordValue).toEqual(value3);
      expect(diaryInstanceAt.closeDay).toBeUndefined();
    });

    test('#8', () => {
      diaryInstanceAt = Diary.instanceAt(diary, day5);

      expect(diaryInstanceAt.state).toBe(states.CLOSED);
      expect(diaryInstanceAt.records).toHaveLength(0);
      expect(diaryInstanceAt.recordValue).toBeUndefined();
      expect(diaryInstanceAt.closeDay).toEqual(day5);
    });

    test('#9', () => {
      diaryInstanceAt = Diary.instanceAt(diary, day6.prev());

      expect(diaryInstanceAt.state).toBe(states.CLOSED);
      expect(diaryInstanceAt.records).toHaveLength(0);
      expect(diaryInstanceAt.recordValue).toBeUndefined();
      expect(diaryInstanceAt.closeDay).toEqual(day5);
    });

    test('#10', () => {
      diaryInstanceAt = Diary.instanceAt(diary, day6);

      expect(diaryInstanceAt.state).toBe(states.STARTED);
      expect(diaryInstanceAt.records).toEqual([{ value: value4, day: day6 }]);
      expect(diaryInstanceAt.recordValue).toEqual(value4);
      expect(diaryInstanceAt.closeDay).toBeUndefined();
    });
  });
});
