import { BaseValue } from '../../_lib';
import { Diary } from './Diary';
import { Day } from '../Day';
import { errors } from '../../errors';

class MockRecord extends BaseValue {
  static valuePropName = 'mockValue';
  constructor({ mockValue, day }) {
    super();
    this.mockValue = mockValue;
    this.day = day;
  }
}

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
const emptyValue = undefined;

let diary;
let diaryInstanceAt;
let records;
let closeDays;

describe('Domain :: commonTypes :: Diary :: #static', () => {
  afterEach(() => {
    diary = undefined;
  });

  describe('#restore', () => {
    describe('positive', () => {
      context('#1', () => {
        beforeEach(() => {
          records = [];
          closeDays = [];
        });

        test('should return new diary', () => {
          diary = Diary.restore(MockRecord, records, closeDays);

          expect(diary.state).toBe(states.NEW);
          expect(diary.records).toHaveLength(0);
          expect(diary.record).toBeUndefined();
          expect(diary.closeDay).toBeUndefined();
        });
      });

      context('#2', () => {
        beforeEach(() => {
          records = [new MockRecord({ mockValue: value1, day: day1 })];
          closeDays = [];
        });

        test('should return started diary', () => {
          diary = Diary.restore(MockRecord, records, closeDays);

          expect(diary.state).toBe(states.STARTED);
          expect(diary.records).toEqual([
            new MockRecord({ mockValue: value1, day: day1 }),
          ]);
          expect(diary.record).toEqual(
            new MockRecord({ mockValue: value1, day: day1 })
          );
          expect(diary.closeDay).toBeUndefined();
        });
      });

      context('#3', () => {
        beforeEach(() => {
          records = [new MockRecord({ mockValue: value1, day: day1 })];
          closeDays = [day2];
        });

        test('should return closed diary', () => {
          diary = Diary.restore(MockRecord, records, closeDays);

          expect(diary.state).toBe(states.CLOSED);
          expect(diary.records).toHaveLength(0);
          expect(diary.record).toBeUndefined();
          expect(diary.closeDay).toEqual(day2);
        });
      });

      context('#4', () => {
        beforeEach(() => {
          records = [
            new MockRecord({ mockValue: value1, day: day1 }),
            new MockRecord({ mockValue: value2, day: day2 }),
          ];
          closeDays = [day3];
        });

        test('should return closed diary', () => {
          diary = Diary.restore(MockRecord, records, closeDays);

          expect(diary.state).toBe(states.CLOSED);
          expect(diary.records).toHaveLength(0);
          expect(diary.record).toBeUndefined();
          expect(diary.closeDay).toEqual(day3);
        });
      });

      context('#5', () => {
        beforeEach(() => {
          records = [
            new MockRecord({ mockValue: value1, day: day1 }),
            new MockRecord({ mockValue: value2, day: day3 }),
          ];
          closeDays = [day2];
        });

        test('should return started diary', () => {
          diary = Diary.restore(MockRecord, records, closeDays);

          expect(diary.state).toBe(states.STARTED);
          expect(diary.records).toEqual([
            new MockRecord({ mockValue: value2, day: day3 }),
          ]);
          expect(diary.record).toEqual(
            new MockRecord({ mockValue: value2, day: day3 })
          );
          expect(diary.closeDay).toBeUndefined();
        });
      });

      context('#6', () => {
        beforeEach(() => {
          records = [
            new MockRecord({ mockValue: value1, day: day1 }),
            new MockRecord({ mockValue: value2, day: day3 }),
            new MockRecord({ mockValue: value3, day: day4 }),
          ];
          closeDays = [day2];
        });

        test('should return started diary', () => {
          diary = Diary.restore(MockRecord, records, closeDays);

          expect(diary.state).toBe(states.STARTED);
          expect(diary.records).toEqual([
            new MockRecord({ mockValue: value2, day: day3 }),
            new MockRecord({ mockValue: value3, day: day4 }),
          ]);
          expect(diary.record).toEqual(
            new MockRecord({ mockValue: value3, day: day4 })
          );
          expect(diary.closeDay).toBeUndefined();
        });
      });

      context('#7', () => {
        beforeEach(() => {
          records = [
            new MockRecord({ mockValue: value1, day: day1 }),
            new MockRecord({ mockValue: value2, day: day3 }),
            new MockRecord({ mockValue: value3, day: day4 }),
          ];
          closeDays = [day2, day5];
        });

        test('should return started diary', () => {
          diary = Diary.restore(MockRecord, records, closeDays);

          expect(diary.state).toBe(states.CLOSED);
          expect(diary.records).toHaveLength(0);
          expect(diary.record).toBeUndefined();
          expect(diary.closeDay).toEqual(day5);
        });
      });

      context('#8', () => {
        beforeEach(() => {
          records = [
            new MockRecord({ mockValue: value1, day: day1 }),
            new MockRecord({ mockValue: value2, day: day3 }),
            new MockRecord({ mockValue: value3, day: day5 }),
          ];
          closeDays = [day2, day4];
        });

        test('should return started diary', () => {
          diary = Diary.restore(MockRecord, records, closeDays);

          expect(diary.state).toBe(states.STARTED);
          expect(diary.records).toEqual([
            new MockRecord({ mockValue: value3, day: day5 }),
          ]);
          expect(diary.record).toEqual(
            new MockRecord({ mockValue: value3, day: day5 })
          );
          expect(diary.closeDay).toBeUndefined();
        });
      });
    });

    describe('negative', () => {
      context('#1', () => {
        beforeEach(() => {
          records = [];
          closeDays = [day1];
        });

        test('should throw exeption', () => {
          expect(() => {
            diary = Diary.restore(MockRecord, records, closeDays);
          }).toThrowError(errors.inconsistentState());
        });
      });

      context('#2', () => {
        beforeEach(() => {
          records = [
            new MockRecord({ mockValue: value1, day: day2 }),
            new MockRecord({ mockValue: value2, day: day3 }),
          ];
          closeDays = [day1];
        });

        test('should throw exeption', () => {
          expect(() => {
            diary = Diary.restore(MockRecord, records, closeDays);
          }).toThrowError(errors.inconsistentState());
        });
      });

      context('#3', () => {
        beforeEach(() => {
          records = [new MockRecord({ mockValue: value1, day: day1 })];
          closeDays = [day2, day3];
        });

        test('should throw exeption', () => {
          expect(() => {
            diary = Diary.restore(MockRecord, records, closeDays);
          }).toThrowError(errors.inconsistentState());
        });
      });
      context('#4', () => {
        beforeEach(() => {
          records = [
            new MockRecord({ mockValue: value1, day: day1 }),
            new MockRecord({ mockValue: value2, day: day4 }),
          ];
          closeDays = [day2, day3];
        });

        test('should throw exeption', () => {
          expect(() => {
            diary = Diary.restore(MockRecord, records, closeDays);
          }).toThrowError(errors.inconsistentState());
        });
      });

      context('#5', () => {
        beforeEach(() => {
          records = [
            new MockRecord({ mockValue: value1, day: day1 }),
            new MockRecord({ mockValue: value2, day: day3 }),
            new MockRecord({ mockValue: value2, day: day4 }),
          ];
          closeDays = [day2];
        });

        test('should throw exeption', () => {
          expect(() => {
            diary = Diary.restore(MockRecord, records, closeDays);
          }).toThrowError(errors.inconsistentState());
        });
      });

      context('#6', () => {
        beforeEach(() => {
          records = [
            new MockRecord({ mockValue: value1, day: day1 }),
            new MockRecord({ mockValue: value2, day: day3 }),
            new MockRecord({ mockValue: value2, day: day4 }),
          ];
          closeDays = [day2, day5];
        });

        test('should throw exeption', () => {
          expect(() => {
            diary = Diary.restore(MockRecord, records, closeDays);
          }).toThrowError(errors.inconsistentState());
        });
      });

      context('#7', () => {
        beforeEach(() => {
          records = [
            new MockRecord({ mockValue: value1, day: day1 }),
            new MockRecord({ mockValue: value2, day: day2 }),
          ];
          closeDays = [day2];
        });

        test('should throw exeption', () => {
          expect(() => {
            diary = Diary.restore(MockRecord, records, closeDays);
          }).toThrowError(errors.inconsistentState());
        });
      });

      context('#8', () => {
        beforeEach(() => {
          records = [
            new MockRecord({ mockValue: value1, day: day1 }),
            new MockRecord({ mockValue: emptyValue, day: day2 }),
          ];
          closeDays = [day3];
        });

        test('should throw exeption', () => {
          expect(() => {
            diary = Diary.restore(MockRecord, records, closeDays);
          }).toThrowError(errors.inconsistentState());
        });
      });

      context('#9', () => {
        beforeEach(() => {
          records = [
            new MockRecord({ mockValue: value1, day: day1 }),
            new MockRecord({ mockValue: value2, day: day1 }),
          ];
          closeDays = [day2];
        });

        test('should throw exeption', () => {
          expect(() => {
            diary = Diary.restore(MockRecord, records, closeDays);
          }).toThrowError(errors.inconsistentState());
        });
      });
    });
  });

  describe('#instanceAt', () => {
    beforeEach(() => {
      diary = Diary.restore(
        MockRecord,
        [
          new MockRecord({ mockValue: value1, day: day1 }),
          new MockRecord({ mockValue: value2, day: day3 }),
          new MockRecord({ mockValue: value3, day: day4 }),
          new MockRecord({ mockValue: value4, day: day6 }),
        ],
        [day2, day5]
      );
    });

    afterEach(() => {
      diaryInstanceAt = undefined;
    });

    test('#1', () => {
      diaryInstanceAt = Diary.instanceAt(diary, day1.prev());

      expect(diaryInstanceAt.state).toBe(states.NEW);
      expect(diaryInstanceAt.records).toHaveLength(0);
      expect(diaryInstanceAt.record).toBeUndefined();
      expect(diaryInstanceAt.closeDay).toBeUndefined();
    });

    test('#2', () => {
      diaryInstanceAt = Diary.instanceAt(diary, day1);

      expect(diaryInstanceAt.state).toBe(states.STARTED);
      expect(diaryInstanceAt.records).toEqual([
        new MockRecord({ mockValue: value1, day: day1 }),
      ]);
      expect(diaryInstanceAt.record).toEqual(
        new MockRecord({ mockValue: value1, day: day1 })
      );
      expect(diaryInstanceAt.closeDay).toBeUndefined();
    });

    test('#3', () => {
      diaryInstanceAt = Diary.instanceAt(diary, day2.prev());

      expect(diaryInstanceAt.state).toBe(states.STARTED);
      expect(diaryInstanceAt.records).toEqual([
        new MockRecord({ mockValue: value1, day: day1 }),
      ]);
      expect(diaryInstanceAt.record).toEqual(
        new MockRecord({ mockValue: value1, day: day1 })
      );
      expect(diaryInstanceAt.closeDay).toBeUndefined();
    });

    test('#4', () => {
      diaryInstanceAt = Diary.instanceAt(diary, day2);

      expect(diaryInstanceAt.state).toBe(states.CLOSED);
      expect(diaryInstanceAt.records).toHaveLength(0);
      expect(diaryInstanceAt.record).toBeUndefined();
      expect(diaryInstanceAt.closeDay).toEqual(day2);
    });

    test('#4', () => {
      diaryInstanceAt = Diary.instanceAt(diary, day3.prev());

      expect(diaryInstanceAt.state).toBe(states.CLOSED);
      expect(diaryInstanceAt.records).toHaveLength(0);
      expect(diaryInstanceAt.record).toBeUndefined();
      expect(diaryInstanceAt.closeDay).toEqual(day2);
    });

    test('#5', () => {
      diaryInstanceAt = Diary.instanceAt(diary, day3);

      expect(diaryInstanceAt.state).toBe(states.STARTED);
      expect(diaryInstanceAt.records).toEqual([
        new MockRecord({ mockValue: value2, day: day3 }),
      ]);
      expect(diaryInstanceAt.record).toEqual(
        new MockRecord({ mockValue: value2, day: day3 })
      );
      expect(diaryInstanceAt.closeDay).toBeUndefined();
    });

    test('#6', () => {
      diaryInstanceAt = Diary.instanceAt(diary, day4.prev());

      expect(diaryInstanceAt.state).toBe(states.STARTED);
      expect(diaryInstanceAt.records).toEqual([
        new MockRecord({ mockValue: value2, day: day3 }),
      ]);
      expect(diaryInstanceAt.record).toEqual(
        new MockRecord({ mockValue: value2, day: day3 })
      );
      expect(diaryInstanceAt.closeDay).toBeUndefined();
    });

    test('#7', () => {
      diaryInstanceAt = Diary.instanceAt(diary, day4);

      expect(diaryInstanceAt.state).toBe(states.STARTED);
      expect(diaryInstanceAt.records).toEqual([
        new MockRecord({ mockValue: value2, day: day3 }),
        new MockRecord({ mockValue: value3, day: day4 }),
      ]);
      expect(diaryInstanceAt.record).toEqual(
        new MockRecord({ mockValue: value3, day: day4 })
      );
      expect(diaryInstanceAt.closeDay).toBeUndefined();
    });

    test('#7', () => {
      diaryInstanceAt = Diary.instanceAt(diary, day5.prev());

      expect(diaryInstanceAt.state).toBe(states.STARTED);
      expect(diaryInstanceAt.records).toEqual([
        new MockRecord({ mockValue: value2, day: day3 }),
        new MockRecord({ mockValue: value3, day: day4 }),
      ]);
      expect(diaryInstanceAt.record).toEqual(
        new MockRecord({ mockValue: value3, day: day4 })
      );
      expect(diaryInstanceAt.closeDay).toBeUndefined();
    });

    test('#8', () => {
      diaryInstanceAt = Diary.instanceAt(diary, day5);

      expect(diaryInstanceAt.state).toBe(states.CLOSED);
      expect(diaryInstanceAt.records).toHaveLength(0);
      expect(diaryInstanceAt.record).toBeUndefined();
      expect(diaryInstanceAt.closeDay).toEqual(day5);
    });

    test('#9', () => {
      diaryInstanceAt = Diary.instanceAt(diary, day6.prev());

      expect(diaryInstanceAt.state).toBe(states.CLOSED);
      expect(diaryInstanceAt.records).toHaveLength(0);
      expect(diaryInstanceAt.record).toBeUndefined();
      expect(diaryInstanceAt.closeDay).toEqual(day5);
    });

    test('#10', () => {
      diaryInstanceAt = Diary.instanceAt(diary, day6);

      expect(diaryInstanceAt.state).toBe(states.STARTED);
      expect(diaryInstanceAt.records).toEqual([
        new MockRecord({ mockValue: value4, day: day6 }),
      ]);
      expect(diaryInstanceAt.record).toEqual(
        new MockRecord({ mockValue: value4, day: day6 })
      );
      expect(diaryInstanceAt.closeDay).toBeUndefined();
    });
  });
});
