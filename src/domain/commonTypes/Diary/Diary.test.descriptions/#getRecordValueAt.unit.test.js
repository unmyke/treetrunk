import { PostId } from '../../PostId';
import { Day } from '../../Day';

import { Diary } from '../Diary';
import { Appointment } from '../../../subdomains/SellerManagement/Appointment';

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

describe('Domain :: entities :: Diary :: #getRecordValueAt', () => {
  let diary;
  beforeEach(() => {
    diary = new Diary({ RecordClass: Appointment, closeValue });
  });

  context('when diary have no diary', () => {
    context('when passed custom day', () => {
      test('should return undefined', () => {
        expect(diary.getRecordValueAt(day1)).toBeUndefined();
      });
    });

    context('when no props passed', () => {
      test('should return undefined', () => {
        expect(diary.getRecordValueAt()).toBeUndefined();
      });
    });
  });

  context('when diary have diary and not closed', () => {
    beforeEach(() => {
      diary.setRecords({
        newRecords: [
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
        ],
      });
    });
    context('when passed day before diary', () => {
      test('should return undefined', () => {
        expect(diary.getRecordValueAt(day1)).toBeUndefined();
      });
    });
    context('when passed day of first appointment', () => {
      test('should return value of first appointment', () => {
        expect(diary.getRecordValueAt(day2)).toBe(value1);
      });
    });
    context('when passed day between first and second diary', () => {
      test('should return value of first appointment', () => {
        expect(diary.getRecordValueAt(day3)).toBe(value1);
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return value of appointment', () => {
        expect(diary.getRecordValueAt(day4)).toBe(value2);
      });
    });
    context('when no props passed', () => {
      test('should return undefined', () => {
        expect(diary.getRecordValueAt()).toBe(value2);
      });
    });
  });

  context('when diary have closed', () => {
    beforeEach(() => {
      diary.setRecords({
        newRecords: [
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
          new Appointment({ postId: closeValue, day: day6 }),
        ],
      });
    });
    context('when passed day before diary', () => {
      test('should return undefined', () => {
        expect(diary.getRecordValueAt(day1)).toBeUndefined();
      });
    });
    context('when passed day of first appointment', () => {
      test('should return value of first appointment', () => {
        expect(diary.getRecordValueAt(day2)).toBe(value1);
      });
    });
    context('when passed day between first and second diary', () => {
      test('should return value of first appointment', () => {
        expect(diary.getRecordValueAt(day3)).toBe(value1);
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return value of appointment', () => {
        expect(diary.getRecordValueAt(day4)).toBe(value2);
      });
    });
    context('when passed day between last appointment and close', () => {
      test('should return value of appointment', () => {
        expect(diary.getRecordValueAt(day5)).toBe(value2);
      });
    });
    context('when passed close day', () => {
      test('should return undefined', () => {
        expect(diary.getRecordValueAt(day6)).toBeUndefined();
      });
    });
    context('when no props passed', () => {
      test('should return undefined', () => {
        expect(diary.getRecordValueAt()).toBeUndefined();
      });
    });
  });

  context('when diary have closed and started again', () => {
    beforeEach(() => {
      diary.setRecords({
        newRecords: [
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
          new Appointment({ postId: closeValue, day: day6 }),
          new Appointment({ postId: value2, day: day8 }),
        ],
      });
    });
    context('when passed day before diary', () => {
      test('should return undefined', () => {
        expect(diary.getRecordValueAt(day1)).toBeUndefined();
      });
    });
    context('when passed day of first appointment', () => {
      test('should return value of first appointment', () => {
        expect(diary.getRecordValueAt(day2)).toBe(value1);
      });
    });
    context('when passed day between first and second diary', () => {
      test('should return value of first appointment', () => {
        expect(diary.getRecordValueAt(day3)).toBe(value1);
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return value of appointment', () => {
        expect(diary.getRecordValueAt(day4)).toBe(value2);
      });
    });
    context('when passed day between last appointment and close', () => {
      test('should return value of appointment', () => {
        expect(diary.getRecordValueAt(day5)).toBe(value2);
      });
    });
    context('when passed close day', () => {
      test('should return undefined', () => {
        expect(diary.getRecordValueAt(day6)).toBeUndefined();
      });
    });
    context('when passed day between close and second start', () => {
      test('should return undefined', () => {
        expect(diary.getRecordValueAt(day7)).toBeUndefined();
      });
    });
    context('when passed second start day', () => {
      test('should return value of second start', () => {
        expect(diary.getRecordValueAt(day8)).toBe(value2);
      });
    });
    context('when no props passed', () => {
      test('should return value of second start', () => {
        expect(diary.getRecordValueAt()).toBe(value2);
      });
    });
  });

  context('when diary have closed, started again and close again', () => {
    beforeEach(() => {
      diary.setRecords({
        newRecords: [
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
          new Appointment({ postId: closeValue, day: day6 }),
          new Appointment({ postId: value2, day: day8 }),
          new Appointment({ postId: closeValue, day: day10 }),
        ],
      });
    });
    context('when passed day before diary', () => {
      test('should return undefined', () => {
        expect(diary.getRecordValueAt(day1)).toBeUndefined();
      });
    });
    context('when passed day of first appointment', () => {
      test('should return value of first appointment', () => {
        expect(diary.getRecordValueAt(day2)).toBe(value1);
      });
    });
    context('when passed day between first and second diary', () => {
      test('should return value of first appointment', () => {
        expect(diary.getRecordValueAt(day3)).toBe(value1);
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return value of appointment', () => {
        expect(diary.getRecordValueAt(day4)).toBe(value2);
      });
    });
    context('when passed day between last appointment and close', () => {
      test('should return value of appointment', () => {
        expect(diary.getRecordValueAt(day5)).toBe(value2);
      });
    });
    context('when passed close day', () => {
      test('should return undefined', () => {
        expect(diary.getRecordValueAt(day6)).toBeUndefined();
      });
    });
    context('when passed day between close and second start', () => {
      test('should return undefined', () => {
        expect(diary.getRecordValueAt(day7)).toBeUndefined();
      });
    });
    context('when passed second start day', () => {
      test('should return value of second start', () => {
        expect(diary.getRecordValueAt(day8)).toBe(value2);
      });
    });
    context('when passed day after second start day', () => {
      test('should return value of second start', () => {
        expect(diary.getRecordValueAt(day9)).toBe(value2);
      });
    });
    context('when passed second close day', () => {
      test('should return undefined', () => {
        expect(diary.getRecordValueAt(day10)).toBeUndefined();
      });
    });
    context('when no props passed', () => {
      test('should return undefined', () => {
        expect(diary.getRecordValueAt()).toBeUndefined();
      });
    });
  });
});
