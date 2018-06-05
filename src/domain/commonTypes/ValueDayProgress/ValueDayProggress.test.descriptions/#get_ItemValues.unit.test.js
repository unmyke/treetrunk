import { PostId } from '../../PostId';
import { Day } from '../../Day';
import { ValueDayProgress } from '../ValueDayProgress';
import { PieceRate } from '../../../subdomains/SellerManagement/PieceRate';
import { Post } from '../../../subdomains/SellerManagement/Post';

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

const interruptValue = new PostId();

describe('Domain :: entities :: ValueDayProgress :: #values', () => {
  let valueDayProgress;
  beforeEach(() => {
    valueDayProgress = new ValueDayProgress({
      lastName,
      firstName,
      middleName,
      phone,
    });
  });

  context('when valueDayProgress have no items', () => {
    test('should return empty array', () => {
      expect(valueDayProgress.values).toEqual([]);
    });
  });

  context('when valueDayProgress have items and not interrupted', () => {
    beforeEach(() => {
      valueDayProgress.setItems([
        new PieceRate({ value: value1, day: day2 }),
        new PieceRate({ value: value2, day: day4 }),
      ]);
    });
    test('should return array with all values between first item and passed day', () => {
      expect(valueDayProgress.values).toEqual([value1, value2]);
    });
  });

  context('when valueDayProgress have interrupted', () => {
    beforeEach(() => {
      valueDayProgress.setItems([
        new PieceRate({ value: value1, day: day2 }),
        new PieceRate({ value: value2, day: day4 }),
        new PieceRate({ value: interruptValue, day: day6 }),
      ]);
    });
    test('should return empty array', () => {
      expect(valueDayProgress.values).toEqual([]);
    });
  });

  context('when valueDayProgress have interrupted and started again', () => {
    beforeEach(() => {
      valueDayProgress.setItems([
        new PieceRate({ value: value1, day: day2 }),
        new PieceRate({ value: value2, day: day4 }),
        new PieceRate({ value: interruptValue, day: day6 }),
        new PieceRate({ value: value2, day: day8 }),
      ]);
    });
    test('should return array with all values between first item and today', () => {
      expect(valueDayProgress.values).toEqual([value2]);
    });
  });

  context(
    'when valueDayProgress have interrupted, started again and interrupt again',
    () => {
      beforeEach(() => {
        valueDayProgress.setItems([
          new PieceRate({ value: value1, day: day2 }),
          new PieceRate({ value: value2, day: day4 }),
          new PieceRate({ value: interruptValue, day: day6 }),
          new PieceRate({ value: value2, day: day8 }),
          new PieceRate({ value: interruptValue, day: day10 }),
        ]);
      });
      test('should return empty array', () => {
        expect(valueDayProgress.values).toEqual([]);
      });
    }
  );
});
