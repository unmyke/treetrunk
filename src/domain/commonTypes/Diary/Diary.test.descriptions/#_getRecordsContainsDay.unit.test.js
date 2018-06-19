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

describe('Domain :: entities :: Diary :: #_getRecordsContainsDay', () => {
  let diary;
  beforeEach(() => {
    diary = new Diary({ RecordClass: Appointment, closeValue });
  });

  context('when diary have no diary', () => {
    context('when passed custom day', () => {
      test('should return empty array', () => {
        expect(diary._getRecordsContainsDay(day1)).toEqual([]);
      });
    });

    context('when no props passed', () => {
      test('should return empty array', () => {
        expect(diary._getRecordsContainsDay()).toEqual([]);
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
      test('should return array with all diary', () => {
        expect(diary._getRecordsContainsDay(day1)).toEqual([
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
        ]);
      });
    });
    context('when passed day of first appointment', () => {
      test('should return array with all diary', () => {
        expect(diary._getRecordsContainsDay(day2)).toEqual([
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
        ]);
      });
    });
    context('when passed day between first and second diary', () => {
      test('should return array with all diary', () => {
        expect(diary._getRecordsContainsDay(day3)).toEqual([
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
        ]);
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return array with all diary', () => {
        expect(diary._getRecordsContainsDay(day4)).toEqual([
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
        ]);
      });
    });
    context('when no props passed', () => {
      test('should return array with all diary', () => {
        expect(diary._getRecordsContainsDay()).toEqual([
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
        ]);
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
      test('should return array with diary without close appointment', () => {
        expect(diary._getRecordsContainsDay(day1)).toEqual([
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
        ]);
      });
    });
    context('when passed day of first appointment', () => {
      test('should return array with diary without close appointment', () => {
        expect(diary._getRecordsContainsDay(day2)).toEqual([
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
        ]);
      });
    });
    context('when passed day between first and second diary', () => {
      test('should return array with diary without close appointment', () => {
        expect(diary._getRecordsContainsDay(day3)).toEqual([
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
        ]);
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return array with diary without close appointment', () => {
        expect(diary._getRecordsContainsDay(day4)).toEqual([
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
        ]);
      });
    });
    context('when passed day between last appointment and close', () => {
      test('should return array with diary without close appointment', () => {
        expect(diary._getRecordsContainsDay(day5)).toEqual([
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
        ]);
      });
    });
    context('when passed close day', () => {
      test('should return empty array', () => {
        expect(diary._getRecordsContainsDay(day6)).toEqual([]);
      });
    });
    context('when no props passed', () => {
      test('should return empty array', () => {
        expect(diary._getRecordsContainsDay()).toEqual([]);
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
      test('should return array with diary before close appointment', () => {
        expect(diary._getRecordsContainsDay(day1)).toEqual([
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
        ]);
      });
    });
    context('when passed day of first appointment', () => {
      test('should return array with diary before close appointment', () => {
        expect(diary._getRecordsContainsDay(day2)).toEqual([
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
        ]);
      });
    });
    context('when passed day between first and second diary', () => {
      test('should return array with diary before close appointment', () => {
        expect(diary._getRecordsContainsDay(day3)).toEqual([
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
        ]);
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return array with diary before close appointment', () => {
        expect(diary._getRecordsContainsDay(day4)).toEqual([
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
        ]);
      });
    });
    context('when passed day between last appointment and close', () => {
      test('should return array with diary before close appointment', () => {
        expect(diary._getRecordsContainsDay(day5)).toEqual([
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
        ]);
      });
    });
    context('when passed close day', () => {
      test('should return array with diary after close appointment', () => {
        expect(diary._getRecordsContainsDay(day6)).toEqual([]);
      });
    });
    context('when passed day between close and second start', () => {
      test('should return array with diary after close appointment', () => {
        expect(diary._getRecordsContainsDay(day7)).toEqual([
          new Appointment({ postId: value2, day: day8 }),
        ]);
      });
    });
    context('when passed second start day', () => {
      test('should return array with diary after close appointment', () => {
        expect(diary._getRecordsContainsDay(day8)).toEqual([
          new Appointment({ postId: value2, day: day8 }),
        ]);
      });
    });
    context('when no props passed', () => {
      test('should return array with diary after close appointment', () => {
        expect(diary._getRecordsContainsDay()).toEqual([
          new Appointment({ postId: value2, day: day8 }),
        ]);
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
      test('should return array with diary before first close appointment', () => {
        expect(diary._getRecordsContainsDay(day1)).toEqual([
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
        ]);
      });
    });
    context('when passed day of first appointment', () => {
      test('should return array with diary before first close appointment', () => {
        expect(diary._getRecordsContainsDay(day2)).toEqual([
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
        ]);
      });
    });
    context('when passed day between first and second diary', () => {
      test('should return array with diary before first close appointment', () => {
        expect(diary._getRecordsContainsDay(day3)).toEqual([
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
        ]);
      });
    });
    context('when passed day of appointment after first', () => {
      test('should return array with diary before first close appointment', () => {
        expect(diary._getRecordsContainsDay(day4)).toEqual([
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
        ]);
      });
    });
    context('when passed day between last appointment and close', () => {
      test('should return array with diary before first close appointment', () => {
        expect(diary._getRecordsContainsDay(day5)).toEqual([
          new Appointment({ postId: value1, day: day2 }),
          new Appointment({ postId: value2, day: day4 }),
        ]);
      });
    });
    context('when passed close day', () => {
      test('should return array with diary beteewn first and second close diary', () => {
        expect(diary._getRecordsContainsDay(day6)).toEqual([]);
      });
    });
    context('when passed day between close and second start', () => {
      test('should return array with diary beteewn first and second close diary', () => {
        expect(diary._getRecordsContainsDay(day7)).toEqual([
          new Appointment({ postId: value2, day: day8 }),
        ]);
      });
    });
    context('when passed second start day', () => {
      test('should return array with only first appointment of second start', () => {
        expect(diary._getRecordsContainsDay(day8)).toEqual([
          new Appointment({ postId: value2, day: day8 }),
        ]);
      });
    });
    context('when passed day after second start day', () => {
      test('should return array with all diary of second start between first appointment and passed day', () => {
        expect(diary._getRecordsContainsDay(day9)).toEqual([
          new Appointment({ postId: value2, day: day8 }),
        ]);
      });
    });
    context('when passed second close day', () => {
      test('should return empty array', () => {
        expect(diary._getRecordsContainsDay(day10)).toEqual([]);
      });
    });
    context('when no props passed', () => {
      test('should return empty array', () => {
        expect(diary._getRecordsContainsDay()).toEqual([]);
      });
    });
  });
});
