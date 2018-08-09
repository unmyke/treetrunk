import { PostId } from '../../PostId';
import { Day } from '../../Day';

import { Diary } from '../Diary';

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

describe('Domain :: entities :: Diary :: #diary', () => {
  let diary;

  context('when diary have no diary', () => {
    beforeEach(() => {
      diary = Diary.restore([], closeValue);
    });
    test('should return empty array', () => {
      expect(diary.records).toEqual([]);
    });
  });

  context('when diary have diary and not closed', () => {
    beforeEach(() => {
      diary = Diary.restore(
        [{ value: value1, day: day2 }, { value: value2, day: day4 }],
        closeValue
      );
    });
    test('should return array with all diary at moment', () => {
      expect(diary.records).toEqual([
        { value: value1, day: day2 },
        { value: value2, day: day4 },
      ]);
    });
  });

  context('when diary have closed', () => {
    beforeEach(() => {
      diary = Diary.restore(
        [
          { value: value1, day: day2 },
          { value: value2, day: day4 },
          { value: closeValue, day: day6 },
        ],
        closeValue
      );
    });
    test('should return empty array', () => {
      expect(diary.records).toEqual([]);
    });
  });

  context('when diary have closed and started again', () => {
    beforeEach(() => {
      diary = Diary.restore(
        [
          { value: value1, day: day2 },
          { value: value2, day: day4 },
          { value: closeValue, day: day6 },
          { value: value2, day: day8 },
        ],
        closeValue
      );
    });
    test('should return array with all diary of second start at moment', () => {
      expect(diary.records).toEqual([{ value: value2, day: day8 }]);
    });
  });

  context('when diary have closed, started again and close again', () => {
    beforeEach(() => {
      diary = Diary.restore(
        [
          { value: value1, day: day2 },
          { value: value2, day: day4 },
          { value: closeValue, day: day6 },
          { value: value2, day: day8 },
          { value: closeValue, day: day10 },
        ],
        closeValue
      );
    });
    test('should return empty array', () => {
      expect(diary.records).toEqual([]);
    });
  });
});
